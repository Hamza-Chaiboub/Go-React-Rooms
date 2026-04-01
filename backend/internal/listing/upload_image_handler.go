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

	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		functions.WriteError(w, http.StatusBadRequest, "file is required")
		return
	}
	defer file.Close()

	contentType := fileHeader.Header.Get("Content-Type")
	if !storage.IsAllowedImageType(contentType) {
		functions.WriteError(w, http.StatusBadRequest, "unsupported image content type")
		return
	}

	data, err := io.ReadAll(file)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to read uploaded file")
		return
	}

	altTextValue := r.FormValue("altText")
	var altText *string
	if altTextValue != "" {
		altText = &altTextValue
	}

	sortOrder := 0
	if raw := r.FormValue("sortOrder"); raw != "" {
		parsed, err := strconv.Atoi(raw)
		if err != nil {
			functions.WriteError(w, http.StatusBadRequest, "sortOrder must be an integer")
			return
		}
		sortOrder = parsed
	}

	isThumbnail := false
	if raw := r.FormValue("isThumbnail"); raw != "" {
		parsed, err := strconv.ParseBool(raw)
		if err != nil {
			functions.WriteError(w, http.StatusBadRequest, "isThumbnail must be a boolean")
			return
		}
		isThumbnail = parsed
	}

	s3key, err := handler.S3.UploadListingImage(r.Context(), listingID, contentType, data)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to upload image to S3")
		return
	}

	image, err := handler.ListingImages.InsertListingImage(r.Context(), listing_images.InsertListingImageParams{
		ListingID:   listingID,
		S3Key:       s3key,
		AltText:     altText,
		SortOrder:   sortOrder,
		IsThumbnail: isThumbnail,
	})
	if err != nil {
		_ = handler.S3.DeleteObject(r.Context(), s3key)
		functions.WriteError(w, http.StatusInternalServerError, "failed to save image metadata")
		return
	}

	functions.WriteJSON(w, http.StatusCreated, image)
}
