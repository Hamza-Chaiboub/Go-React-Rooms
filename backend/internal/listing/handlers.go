package listing

import (
	"database/sql"
	"encoding/json"
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/listing_images"
	"go-react-rooms/internal/repositories/listings"
	"go-react-rooms/internal/storage"
	"io"
	"net/http"
	"strconv"
)

type Handler struct {
	Listings      listings.Repo
	ListingImages listing_images.Repo
	S3            *storage.S3Storage
	DB            *sql.DB
}

type CreateListingResponse struct {
	Listing listings.Listing              `json:"listing"`
	Images  []listing_images.ListingImage `json:"images"`
}

func (handler Handler) CreateListing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed, use POST")
		return
	}
	UserID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req listings.InsertParams
	req.UserID = UserID
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		functions.WriteError(w, http.StatusBadRequest, "at least one file is required")
		return
	}

	thumbnailIndex := 0
	if raw := r.FormValue("thumbnailIndex"); raw != "" {
		parsed, err := strconv.Atoi(raw)
		if err != nil {
			functions.WriteError(w, http.StatusBadRequest, "thumbnailIndex must be an integer")
			return
		}
		thumbnailIndex = parsed
	}

	if thumbnailIndex < 0 || thumbnailIndex >= len(files) {
		functions.WriteError(w, http.StatusBadRequest, "thumbnailIndex is out of range")
		return
	}

	altTextValue := r.FormValue("altText")
	var altText *string
	if altTextValue != "" {
		altText = &altTextValue
	}

	type validatedFile struct {
		ContentType string
		Data        []byte
	}

	validatedFiles := make([]validatedFile, 0, len(files))

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			functions.WriteError(w, http.StatusInternalServerError, "failed to open uploaded file")
			return
		}

		buffer := make([]byte, 512)
		n, err := file.Read(buffer)
		if err != nil && err != io.EOF {
			_ = file.Close()
			functions.WriteError(w, http.StatusInternalServerError, "failed to read uploaded file")
			return
		}

		contentType := http.DetectContentType(buffer[:n])
		if !storage.IsAllowedImageType(contentType) {
			_ = file.Close()
			functions.WriteError(w, http.StatusBadRequest, "unsupported image content type")
			return
		}

		if _, err := file.Seek(0, 0); err != nil {
			_ = file.Close()
			functions.WriteError(w, http.StatusInternalServerError, "failed to reset uploaded file")
			return
		}

		data, err := io.ReadAll(file)
		_ = file.Close()
		if err != nil {
			functions.WriteError(w, http.StatusInternalServerError, "failed to read uploaded file bytes")
			return
		}

		validatedFiles = append(validatedFiles, validatedFile{
			ContentType: contentType,
			Data:        data,
		})
	}

	tx, err := handler.DB.BeginTx(r.Context(), nil)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to start transaction")
		return
	}

	uploadedKeys := make([]string, 0, len(validatedFiles))
	cleanupS3 := func() {
		for _, key := range uploadedKeys {
			_ = handler.S3.DeleteObject(r.Context(), key)
		}
	}

	defer func() {
		_ = tx.Rollback()
	}()

	listing, err := handler.Listings.InsertTx(r.Context(), tx, req)
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	createdImages := make([]listing_images.ListingImage, 0, len(validatedFiles))

	for i, file := range validatedFiles {
		s3Key, err := handler.S3.UploadListingImage(r.Context(), listing.ID, file.ContentType, file.Data)
		if err != nil {
			cleanupS3()
			functions.WriteError(w, http.StatusInternalServerError, "failed to upload image to S3")
			return
		}

		uploadedKeys = append(uploadedKeys, s3Key)

		image, err := handler.ListingImages.InsertListingImageTx(r.Context(), tx, listing_images.InsertListingImageParams{
			ListingID:   listing.ID,
			S3Key:       s3Key,
			AltText:     altText,
			SortOrder:   i,
			IsThumbnail: i == thumbnailIndex,
		})
		if err != nil {
			cleanupS3()
			functions.WriteError(w, http.StatusInternalServerError, "failed to save image metadata")
			return
		}

		createdImages = append(createdImages, image)
	}

	if err := tx.Commit(); err != nil {
		cleanupS3()
		functions.WriteError(w, http.StatusInternalServerError, "failed to commit transaction")
		return
	}

	functions.WriteJSON(w, http.StatusCreated, CreateListingResponse{
		Listing: listing,
		Images:  createdImages,
	})
}

func (handler Handler) ListListings(w http.ResponseWriter, r *http.Request) {
	items, err := handler.Listings.GetAllListings(r.Context())
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "could not list listings")
		return
	}

	functions.WriteJSON(w, http.StatusOK, map[string]any{
		"listings": items,
	})
}
