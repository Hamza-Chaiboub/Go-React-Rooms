package storage

import (
	"encoding/json"
	"go-react-rooms/internal/functions"
	"net/http"
)

type UploadHandler struct {
	S3 *S3Storage
}

type CreateImageUploadRequest struct {
	ListingID   string `json:"listingId"`
	ContentType string `json:"contentType"`
}

type GetImageURLRequest struct {
	Key string `json:"key"`
}

type GetImageURLResponse struct {
	URL string `json:"url"`
}

func NewUploadHandler(s3Storage *S3Storage) *UploadHandler {
	return &UploadHandler{S3: s3Storage}
}

func (handler *UploadHandler) CreateImageUploadURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var req CreateImageUploadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	if req.ListingID == "" {
		functions.WriteError(w, http.StatusBadRequest, "listingId is required")
		return
	}

	if !IsAllowedImageType(req.ContentType) {
		functions.WriteError(w, http.StatusBadRequest, "unsupported image content type")
		return
	}

	result, err := handler.S3.CreatePresignedImageUploadURL(
		r.Context(),
		req.ListingID,
		req.ContentType,
	)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to create upload URL")
		return
	}

	functions.WriteJSON(w, http.StatusOK, result)
}

func (handler *UploadHandler) GetImageURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		functions.WriteError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var req GetImageURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		functions.WriteError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	if req.Key == "" {
		functions.WriteError(w, http.StatusBadRequest, "key is required")
		return
	}

	url, err := handler.S3.CreatePresignedGetURL(r.Context(), req.Key)
	if err != nil {
		functions.WriteError(w, http.StatusInternalServerError, "failed to create image URL")
		return
	}

	functions.WriteJSON(w, http.StatusOK, url)
}
