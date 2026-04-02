package listing

import (
	"go-react-rooms/internal/functions"
	"go-react-rooms/internal/middleware"
	"go-react-rooms/internal/repositories/listing_images"
	"go-react-rooms/internal/repositories/listings"
	"go-react-rooms/internal/storage"
	"io"
	"net/http"
	"strconv"
)

type ImageUploadHandler struct {
	Listings      listings.Repo
	ListingImages listing_images.Repo
	S3            *storage.S3Storage
}

func NewImageUploadhandler(listingsRepo listings.Repo, listingImagesRepo listing_images.Repo, s3Storage *storage.S3Storage) *ImageUploadHandler {
	return &ImageUploadHandler{
		Listings:      listingsRepo,
		ListingImages: listingImagesRepo,
		S3:            s3Storage,
	}
}

func (handler *ImageUploadHandler) UploadListingImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok || userID == "" {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	// max memory 10 MB
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid multipart form")
		return
	}

	listingID := r.FormValue("listingId")
	if listingID == "" {
		functions.WriteError(w, http.StatusBadRequest, "listingId is required")
		return
	}

	allowed, err := handler.Listings.UserOwnsListing(r.Context(), userID, listingID)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to verify listing ownership")
		return
	}
	if !allowed {
		functions.WriteError(w, http.StatusForbidden, "you do not own this listing")
		return
	}

	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		functions.WriteError(w, http.StatusBadRequest, "at least one file is required")
		return
	}

	altTextValue := r.FormValue("altText")
	var altText *string
	if altTextValue != "" {
		altText = &altTextValue
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

	createdImages := make([]listing_images.ListingImage, 0, len(files))
	uploadedKeys := make([]string, 0, len(files))

	cleanupUploaded := func() {
		for _, key := range uploadedKeys {
			_ = handler.S3.DeleteObject(r.Context(), key)
		}
	}

	for i, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			cleanupUploaded()
			functions.WriteError(w, http.StatusInternalServerError, "failed to open uploaded file")
			return
		}

		buffer := make([]byte, 512)
		n, err := file.Read(buffer)
		if err != nil && err != io.EOF {
			_ = file.Close()
			cleanupUploaded()
			functions.WriteError(w, http.StatusInternalServerError, "failed to read uploaded file")
			return
		}

		contentType := http.DetectContentType(buffer[:n])
		if !storage.IsAllowedImageType(contentType) {
			_ = file.Close()
			cleanupUploaded()
			functions.WriteError(w, http.StatusBadRequest, "unsupported image content type")
			return
		}

		if _, err := file.Seek(0, 0); err != nil {
			_ = file.Close()
			cleanupUploaded()
			functions.WriteError(w, http.StatusInternalServerError, "failed to reset uploaded file")
			return
		}

		data, err := io.ReadAll(file)
		_ = file.Close()
		if err != nil {
			cleanupUploaded()
			functions.WriteError(w, http.StatusInternalServerError, "failed to read uploaded file bytes")
			return
		}

		s3Key, err := handler.S3.UploadListingImage(r.Context(), listingID, contentType, data)
		if err != nil {
			cleanupUploaded()
			functions.WriteError(w, http.StatusInternalServerError, "failed to upload file to S3")
			return
		}

		uploadedKeys = append(uploadedKeys, s3Key)

		image, err := handler.ListingImages.InsertListingImage(r.Context(), listing_images.InsertListingImageParams{
			ListingID:   listingID,
			S3Key:       s3Key,
			AltText:     altText,
			SortOrder:   i,
			IsThumbnail: i == thumbnailIndex,
		})
		if err != nil {
			cleanupUploaded()
			functions.WriteError(w, http.StatusInternalServerError, "failed to save image metadata")
			return
		}

		createdImages = append(createdImages, image)
	}

	functions.WriteJSON(w, http.StatusCreated, createdImages)
}
