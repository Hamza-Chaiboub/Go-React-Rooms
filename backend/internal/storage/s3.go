package storage

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	config2 "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type S3Storage struct {
	Client *s3.Client
	Bucket string
	Region string
}

type PresignedUpload struct {
	URL string `json:"url"`
	Key string `json:"key"`
}

var allowedImageTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
}

func NewS3Storage(ctx context.Context) (*S3Storage, error) {
	region := os.Getenv("AWS_REGION")
	if region == "" {
		return nil, fmt.Errorf("AWS_REGION is required " + region)
	}

	bucket := os.Getenv("AWS_S3_BUCKET")
	if bucket == "" {
		return nil, fmt.Errorf("AWS_S3_BUCKET is required")
	}

	config, err := config2.LoadDefaultConfig(ctx, config2.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load AWS config: %w", err)
	}

	client := s3.NewFromConfig(config)

	return &S3Storage{
		Client: client,
		Bucket: bucket,
		Region: region,
	}, nil
}

func IsAllowedImageType(contentType string) bool {
	return allowedImageTypes[contentType]
}

func BuildListingImageKey(ListingID string, contentType string) (string, error) {
	if !IsAllowedImageType(contentType) {
		return "", fmt.Errorf("unsupported content type: %s", contentType)
	}

	ext := ""
	switch contentType {
	case "image/jpeg":
		ext = ".jpg"
	case "image/png":
		ext = ".png"
	case "image/webp":
		ext = ".webp"
	default:
		ext = ""
	}

	id := uuid.NewString()
	return fmt.Sprintf("listings/%s/images/%s%s", ListingID, id, ext), nil
}

func (storage *S3Storage) CreatePresignedImageUploadURL(ctx context.Context, ListingID string, contentType string) (*PresignedUpload, error) {
	key, err := BuildListingImageKey(ListingID, contentType)
	if err != nil {
		return nil, err
	}

	presigner := s3.NewPresignClient(storage.Client)

	req, err := presigner.PresignPutObject(
		ctx,
		&s3.PutObjectInput{
			Bucket:      aws.String(storage.Bucket),
			Key:         aws.String(key),
			ContentType: aws.String(contentType),
		},
		s3.WithPresignExpires(15*time.Minute),
	)
	if err != nil {
		return nil, fmt.Errorf("presign put object: %w", err)
	}

	return &PresignedUpload{
		URL: req.URL,
		Key: key,
	}, nil
}

func (storage *S3Storage) CreatePresignedGetURL(ctx context.Context, key string) (string, error) {
	presigner := s3.NewPresignClient(storage.Client)

	req, err := presigner.PresignGetObject(
		ctx,
		&s3.GetObjectInput{
			Bucket: aws.String(storage.Bucket),
			Key:    aws.String(key),
		},
		s3.WithPresignExpires(15*time.Minute),
	)
	if err != nil {
		return "", fmt.Errorf("presign get object: %w", err)
	}

	return req.URL, nil
}
