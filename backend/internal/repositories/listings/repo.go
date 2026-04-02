package listings

import (
	"context"
	"database/sql"
	"time"
)

type Listing struct {
	ID               string         `json:"id"`
	UserID           string         `json:"userId"`
	Title            string         `json:"title"`
	Description      *string        `json:"description,omitempty"`
	AddressLine1     string         `json:"addressLine1"`
	AddressLine2     *string        `json:"addressLine2,omitempty"`
	City             string         `json:"city"`
	Province         string         `json:"province"`
	Country          string         `json:"country"`
	PostalCode       *string        `json:"postalCode,omitempty"`
	Latitude         float64        `json:"latitude"`
	Longitude        float64        `json:"longitude"`
	Bedrooms         int            `json:"bedrooms"`
	Bathrooms        float64        `json:"bathrooms"`
	Area             float64        `json:"area"`
	AreaUnit         string         `json:"areaUnit"`
	Price            float64        `json:"price"`
	Currency         string         `json:"currency"`
	AvailableFrom    time.Time      `json:"availableFrom"`
	AvailableUntil   *time.Time     `json:"availableUntil,omitempty"`
	MinLeaseDays     *int           `json:"minLeaseDays,omitempty"`
	IsFurnished      bool           `json:"isFurnished"`
	PetsAllowed      bool           `json:"petsAllowed"`
	SmokingAllowed   bool           `json:"smokingAllowed"`
	ParkingAvailable bool           `json:"parkingAvailable"`
	Status           string         `json:"status"`
	CreatedAt        time.Time      `json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
	Images           []ListingImage `json:"images,omitempty"`
}

type ListingImage struct {
	ID          string
	ListingID   string
	S3Key       string
	AltText     *string
	SortOrder   int
	IsThumbnail bool
	CreatedAt   time.Time
}

type Repo struct {
	DB *sql.DB
}

type InsertParams struct {
	UserID           string
	Title            string
	Description      *string
	AddressLine1     string
	AddressLine2     *string
	City             string
	Province         string
	Country          string
	PostalCode       *string
	Latitude         float64
	Longitude        float64
	Bedrooms         int
	Bathrooms        float64
	Area             float64
	AreaUnit         string
	Price            float64
	Currency         string
	AvailableFrom    time.Time
	AvailableUntil   *time.Time
	MinLeaseDays     *int
	IsFurnished      bool
	PetsAllowed      bool
	SmokingAllowed   bool
	ParkingAvailable bool
	Status           string
}

func (repo Repo) Insert(ctx context.Context, params InsertParams) (Listing, error) {
	var listing Listing
	err := repo.DB.QueryRowContext(ctx, `
		INSERT INTO listings (
			user_id, 
		    title, 
		    description, 
		    address_line1, 
		    address_line2, 
		    city, 
		    province, 
		    country,
		    postal_code, 
		    latitude, 
		    longitude, 
		    bedrooms, 
		    bathrooms, 
		    area, 
		    area_unit, 
		    price, 
		    currency,
		    available_from, 
		    available_until, 
		    min_lease_days, 
		    is_furnished, 
		    pets_allowed, 
		    smoking_allowed,
		    parking_available, 
		    status
		)
		VALUES (
		    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
		    $21, $22, $23, $24, $25
		)
		RETURNING
			id::text, 
			user_id::text, 
			title, 
			description, 
			address_line1, 
			address_line2, 
			city, 
			province,
			country,
		    postal_code, 
		    latitude, 
		    longitude, 
		    bedrooms, 
		    bathrooms, 
		    area, 
		    area_unit, 
		    price, 
		    currency,
		    available_from, 
		    available_until, 
		    min_lease_days, 
		    is_furnished, 
		    pets_allowed, 
		    smoking_allowed,
		    parking_available, 
		    status,
		    created_at, 
		    updated_at
		`,
		params.UserID,
		params.Title,
		params.Description,
		params.AddressLine1,
		params.AddressLine2,
		params.City,
		params.Province,
		params.Country,
		params.PostalCode,
		params.Latitude,
		params.Longitude,
		params.Bedrooms,
		params.Bathrooms,
		params.Area,
		params.AreaUnit,
		params.Price,
		params.Currency,
		params.AvailableFrom,
		params.AvailableUntil,
		params.MinLeaseDays,
		params.IsFurnished,
		params.PetsAllowed,
		params.SmokingAllowed,
		params.ParkingAvailable,
		params.Status,
	).Scan(
		&listing.ID,
		&listing.UserID,
		&listing.Title,
		&listing.Description,
		&listing.AddressLine1,
		&listing.AddressLine2,
		&listing.City,
		&listing.Province,
		&listing.Country,
		&listing.PostalCode,
		&listing.Latitude,
		&listing.Longitude,
		&listing.Bedrooms,
		&listing.Bathrooms,
		&listing.Area,
		&listing.AreaUnit,
		&listing.Price,
		&listing.Currency,
		&listing.AvailableFrom,
		&listing.AvailableUntil,
		&listing.MinLeaseDays,
		&listing.IsFurnished,
		&listing.PetsAllowed,
		&listing.SmokingAllowed,
		&listing.ParkingAvailable,
		&listing.Status,
		&listing.CreatedAt,
		&listing.UpdatedAt,
	)

	return listing, err
}

func (repo Repo) GetAllListings(ctx context.Context) ([]Listing, error) {
	rows, err := repo.DB.QueryContext(ctx, `
		SELECT
			l.id::text,
			l.user_id::text,
			l.title,
			l.description,
			l.address_line1,
			l.address_line2,
			l.city,
			l.province,
			l.country,
			l.postal_code,
			l.latitude,
			l.longitude,
			l.bedrooms,
			l.bathrooms,
			l.area,
			l.area_unit,
			l.price,
			l.currency,
			l.available_from,
			l.available_until,
			l.min_lease_days,
			l.is_furnished,
			l.pets_allowed,
			l.smoking_allowed,
			l.parking_available,
			l.status,
			l.created_at,
			l.updated_at,
			li.id::text,
			li.listing_id::text,
			li.s3_key,
			li.alt_text,
			li.sort_order,
			li.is_thumbnail,
			li.created_at
		FROM listings l
		LEFT JOIN listing_images li ON li.listing_id = l.id
		ORDER BY l.created_at DESC, li.sort_order ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	listingsByID := make(map[string]*Listing)
	var orderedIDs []string

	for rows.Next() {
		var listing Listing

		var imageID sql.NullString
		var imageListingID sql.NullString
		var imageS3Key sql.NullString
		var imageAltText sql.NullString
		var imageSortOrder sql.NullInt64
		var imageIsThumbnail sql.NullBool
		var imageCreatedAt sql.NullTime

		err := rows.Scan(
			&listing.ID,
			&listing.UserID,
			&listing.Title,
			&listing.Description,
			&listing.AddressLine1,
			&listing.AddressLine2,
			&listing.City,
			&listing.Province,
			&listing.Country,
			&listing.PostalCode,
			&listing.Latitude,
			&listing.Longitude,
			&listing.Bedrooms,
			&listing.Bathrooms,
			&listing.Area,
			&listing.AreaUnit,
			&listing.Price,
			&listing.Currency,
			&listing.AvailableFrom,
			&listing.AvailableUntil,
			&listing.MinLeaseDays,
			&listing.IsFurnished,
			&listing.PetsAllowed,
			&listing.SmokingAllowed,
			&listing.ParkingAvailable,
			&listing.Status,
			&listing.CreatedAt,
			&listing.UpdatedAt,
			&imageID,
			&imageListingID,
			&imageS3Key,
			&imageAltText,
			&imageSortOrder,
			&imageIsThumbnail,
			&imageCreatedAt,
		)
		if err != nil {
			return nil, err
		}

		existing, found := listingsByID[listing.ID]
		if !found {
			listing.Images = []ListingImage{}
			listingsByID[listing.ID] = &listing
			orderedIDs = append(orderedIDs, listing.ID)
			existing = &listing
		}

		if imageID.Valid {
			var altText *string
			if imageAltText.Valid {
				altText = &imageAltText.String
			}

			existing.Images = append(existing.Images, ListingImage{
				ID:          imageID.String,
				ListingID:   imageListingID.String,
				S3Key:       imageS3Key.String,
				AltText:     altText,
				SortOrder:   int(imageSortOrder.Int64),
				IsThumbnail: imageIsThumbnail.Bool,
				CreatedAt:   imageCreatedAt.Time,
			})
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	out := make([]Listing, 0, len(orderedIDs))
	for _, id := range orderedIDs {
		out = append(out, *listingsByID[id])
	}

	return out, nil
}

func (repo Repo) UserOwnsListing(ctx context.Context, UserID string, listingID string) (bool, error) {
	var exists bool

	err := repo.DB.QueryRowContext(ctx, `
		SELECT EXISTS (
		    SELECT 1
		    FROM listings
		    WHERE id::text = $1
		    	AND user_id::text = $2
		)`, listingID, UserID).Scan(&exists)

	return exists, err
}
