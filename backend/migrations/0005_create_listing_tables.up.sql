CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LISTINGS
CREATE TABLE IF NOT EXISTS listings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    address_line1 text NOT NULL,
    address_line2 text,
    city text NOT NULL,
    province text NOT NULL,
    country text NOT NULL DEFAULT 'Canada',
    postal_code text,
    latitude numeric(9,6),
    longitude numeric(9,6),
    bedrooms integer NOT NULL CHECK (bedrooms >= 0),
    bathrooms numeric(3,1) NOT NULL CHECK (bathrooms >= 0),
    area numeric(10,2) CHECK (area > 0),
    area_unit text NOT NULL DEFAULT 'sqft' CHECK (area_unit IN ('sqft', 'sqm')),
    price numeric(10,2) NOT NULL CHECK (price > 0),
    currency text NOT NULL DEFAULT 'CAD' CHECK (char_length(currency) = 3),
    available_from date NOT NULL,
    available_until date,
    min_lease_days integer CHECK (min_lease_days > 0),
    is_furnished boolean NOT NULL DEFAULT false,
    pets_allowed boolean NOT NULL DEFAULT false,
    smoking_allowed boolean NOT NULL DEFAULT false,
    parking_available boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'rented', 'inactive', 'archived')),
    thumbnail_image_id uuid NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (available_until IS NULL OR available_until >= available_from)
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_city_province ON listings(city, province);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_available_from ON listings(available_from);

-- LISTING IMAGES
CREATE TABLE IF NOT EXISTS listing_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_thumbnail boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_sort ON listing_images(listing_id, sort_order);

-- only one thumbnail flag per listing
CREATE UNIQUE INDEX IF NOT EXISTS uniq_listing_images_single_thumbnail ON listing_images(listing_id) WHERE is_thumbnail = true;

-- AMENITIES MASTER TABLE
CREATE TABLE IF NOT EXISTS amenities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key text NOT NULL UNIQUE,
    label text NOT NULL,
    category text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listing_amenities (
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    amenity_id uuid NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, amenity_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_amenities_amenity_id ON listing_amenities(amenity_id);

-- SAVED LISTINGS
CREATE TABLE IF NOT EXISTS saved_listings (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON saved_listings(listing_id);

-- CONTACT REQUESTS
CREATE TABLE IF NOT EXISTS contact_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    sender_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject text,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'accepted', 'declined', 'closed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (sender_user_id <> recipient_user_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_listing_id ON contact_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_sender_user_id ON contact_requests(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_recipient_user_id ON contact_requests(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);

-- ROOMMATE PREFERENCES
CREATE TABLE IF NOT EXISTS roommate_preferences (
    user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    preferred_city text,
    preferred_province text,
    budget_min numeric(10,2) CHECK (budget_min >= 0),
    budget_max numeric(10,2) CHECK (budget_max >= 0),
    move_in_date date,
    preferred_bedrooms integer CHECK (preferred_bedrooms >= 0),
    preferred_bathrooms numeric(3,1) CHECK (preferred_bathrooms >= 0),
    furnished_preferred boolean,
    pets_ok boolean,
    smoking_ok boolean,
    parking_needed boolean,
    gender_preference text
    CHECK (gender_preference IN ('male', 'female', 'any', 'other') OR gender_preference IS NULL),
    min_age integer CHECK (min_age >= 18),
    max_age integer CHECK (max_age >= 18),
    occupation text,
    lifestyle_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min),
    CHECK (max_age IS NULL OR min_age IS NULL OR max_age >= min_age)
);

-- ROOMMATE PREFERENCE AMENITIES
CREATE TABLE IF NOT EXISTS roommate_preference_amenities (
    user_id uuid NOT NULL REFERENCES roommate_preferences(user_id) ON DELETE CASCADE,
    amenity_id uuid NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, amenity_id)
);

CREATE INDEX IF NOT EXISTS idx_roommate_preference_amenities_amenity_id
    ON roommate_preference_amenities(amenity_id);