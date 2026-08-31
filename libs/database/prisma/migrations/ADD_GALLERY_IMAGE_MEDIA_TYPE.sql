-- Additive migration for Cloudinary-backed public gallery uploads.
-- This does not drop tables or modify existing rows.
ALTER TYPE "MediaType"
  ADD VALUE IF NOT EXISTS 'GALLERY_IMAGE';
