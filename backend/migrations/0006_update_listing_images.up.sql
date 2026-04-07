ALTER TABLE listing_images
RENAME COLUMN image_url TO s3_key;

ALTER TABLE listings
DROP COLUMN thumbnail_image_id;