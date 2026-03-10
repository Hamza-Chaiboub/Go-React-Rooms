package listings

import (
	"context"
	"database/sql"
	"time"
)

type Listing struct {
	ID               string     `json:"id"`
	UserID           string     `json:"userId"`
	Title            string     `json:"title"`
	Description      *string    `json:"description,omitempty"`
	AddressLine1     string     `json:"addressLine1"`
	AddressLine2     *string    `json:"addressLine2,omitempty"`
	City             string     `json:"city"`
	Province         string     `json:"province"`
	Country          string     `json:"country"`
	PostalCode       *string    `json:"postalCode,omitempty"`
	Latitude         float64    `json:"latitude"`
	Longitude        float64    `json:"longitude"`
	Bedrooms         int        `json:"bedrooms"`
	Bathrooms        float64    `json:"bathrooms"`
	Area             float64    `json:"area"`
	AreaUnit         string     `json:"areaUnit"`
	Price            float64    `json:"price"`
	Currency         string     `json:"currency"`
	AvailableFrom    time.Time  `json:"availableFrom"`
	AvailableUntil   *time.Time `json:"availableUntil,omitempty"`
	MinLeaseDays     *int       `json:"minLeaseDays,omitempty"`
	IsFurnished      bool       `json:"isFurnished"`
	PetsAllowed      bool       `json:"petsAllowed"`
	SmokingAllowed   bool       `json:"smokingAllowed"`
	ParkingAvailable bool       `json:"parkingAvailable"`
	Status           string     `json:"status"`
	ThumbnailImageId *string    `json:"thumbnailImageId,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
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
	ThumbnailImageId *string
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
		    status, 
		    thumbnail_image_id
		)
		VALUES (
		    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
		    $21, $22, $23, $24, $25, $26
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
		    thumbnail_image_id::text, 
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
		params.ThumbnailImageId,
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
		&listing.ThumbnailImageId,
		&listing.CreatedAt,
		&listing.UpdatedAt,
	)

	return listing, err
}
