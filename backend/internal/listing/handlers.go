package listing

import (
	"database/sql"
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

func (h Handler) CreateListing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed, use POST")
		return
	}

	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok || userID == "" {
		functions.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	if err := r.ParseMultipartForm(25 << 20); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid multipart form")
		return
	}

	bedrooms, err := parseRequiredInt(r.FormValue("bedrooms"), "bedrooms")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	bathrooms, err := parseRequiredFloat(r.FormValue("bathrooms"), "bathrooms")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	area, err := parseRequiredFloat(r.FormValue("area"), "area")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	price, err := parseRequiredFloat(r.FormValue("price"), "price")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	latitude, err := parseRequiredFloat(r.FormValue("latitude"), "latitude")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	longitude, err := parseRequiredFloat(r.FormValue("longitude"), "longitude")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	isFurnished, err := parseRequiredBool(r.FormValue("isFurnished"), "isFurnished")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	petsAllowed, err := parseRequiredBool(r.FormValue("petsAllowed"), "petsAllowed")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	smokingAllowed, err := parseRequiredBool(r.FormValue("smokingAllowed"), "smokingAllowed")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	parkingAvailable, err := parseRequiredBool(r.FormValue("parkingAvailable"), "parkingAvailable")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	availableFrom, err := parseOptionalTime(r.FormValue("availableFrom"))
	if err != nil || availableFrom == nil {
		functions.WriteError(w, http.StatusBadRequest, "availableFrom must be a valid RFC3339 datetime")
		return
	}

	availableUntil, err := parseOptionalTime(r.FormValue("availableUntil"))
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, "availableUntil must be a valid RFC3339 datetime")
		return
	}

	minLeaseDays, err := parseOptionalInt(r.FormValue("minLeaseDays"))
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, "minLeaseDays must be an integer")
		return
	}

	params := listings.InsertParams{
		UserID:           userID,
		Title:            r.FormValue("title"),
		Description:      parseOptionalString(r.FormValue("description")),
		AddressLine1:     r.FormValue("addressLine1"),
		AddressLine2:     parseOptionalString(r.FormValue("addressLine2")),
		City:             r.FormValue("city"),
		Province:         r.FormValue("province"),
		Country:          r.FormValue("country"),
		PostalCode:       parseOptionalString(r.FormValue("postalCode")),
		Latitude:         latitude,
		Longitude:        longitude,
		Bedrooms:         bedrooms,
		Bathrooms:        bathrooms,
		Area:             area,
		AreaUnit:         r.FormValue("areaUnit"),
		Price:            price,
		Currency:         r.FormValue("currency"),
		AvailableFrom:    *availableFrom,
		AvailableUntil:   availableUntil,
		MinLeaseDays:     minLeaseDays,
		IsFurnished:      isFurnished,
		PetsAllowed:      petsAllowed,
		SmokingAllowed:   smokingAllowed,
		ParkingAvailable: parkingAvailable,
		Status:           r.FormValue("status"),
	}

	if params.Title == "" || params.AddressLine1 == "" || params.City == "" || params.Province == "" || params.Country == "" || params.AreaUnit == "" || params.Currency == "" || params.Status == "" {
		functions.WriteError(w, http.StatusBadRequest, "missing required listing fields")
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

	tx, err := h.DB.BeginTx(r.Context(), nil)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to start transaction")
		return
	}

	uploadedKeys := make([]string, 0, len(validatedFiles))
	cleanupS3 := func() {
		for _, key := range uploadedKeys {
			_ = h.S3.DeleteObject(r.Context(), key)
		}
	}

	defer func() {
		_ = tx.Rollback()
	}()

	listing, err := h.Listings.InsertTx(r.Context(), tx, params)
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, err.Error())
		return
	}

	createdImages := make([]listing_images.ListingImage, 0, len(validatedFiles))

	for i, file := range validatedFiles {
		s3Key, err := h.S3.UploadListingImage(r.Context(), listing.ID, file.ContentType, file.Data)
		if err != nil {
			cleanupS3()
			functions.WriteError(w, http.StatusInternalServerError, "failed to upload image to S3")
			return
		}

		uploadedKeys = append(uploadedKeys, s3Key)

		image, err := h.ListingImages.InsertListingImageTx(r.Context(), tx, listing_images.InsertListingImageParams{
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
