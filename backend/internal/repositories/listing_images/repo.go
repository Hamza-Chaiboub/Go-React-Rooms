package listing_images

import (
	"context"
	"database/sql"
	"time"
)

type ListingImage struct {
	ID          string    `json:"id"`
	ListingID   string    `json:"listingId"`
	S3Key       string    `json:"s3Key"`
	AltText     *string   `json:"altText,omitempty"`
	SortOrder   int       `json:"sortOrder"`
	IsThumbnail bool      `json:"isThumbnail"`
	CreatedAt   time.Time `json:"createdAt"`
}

type InsertListingImageParams struct {
	ListingID   string
	S3Key       string
	AltText     *string
	SortOrder   int
	IsThumbnail bool
}

type Repo struct {
	DB *sql.DB
}

func (repo Repo) InsertListingImage(ctx context.Context, params InsertListingImageParams) (ListingImage, error) {
	var image ListingImage

	err := repo.DB.QueryRowContext(ctx, `
		INSERT INTO listing_images (
			listing_id,
		    s3_key,
		    alt_text,
			sort_order,
		    is_thumbnail
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING
			id::text,
			listing_id::text,
			s3_key,
			alt_text,
			sort_order,
			is_thumbnail,
			created_at
		`,
		params.ListingID,
		params.S3Key,
		params.AltText,
		params.SortOrder,
		params.IsThumbnail,
	).Scan(
		&image.ID,
		&image.ListingID,
		&image.S3Key,
		&image.AltText,
		&image.SortOrder,
		&image.IsThumbnail,
		&image.CreatedAt,
	)

	return image, err
}
