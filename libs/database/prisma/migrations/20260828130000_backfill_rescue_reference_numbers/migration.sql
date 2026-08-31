UPDATE "rescue_requests"
SET "referenceNumber" = 'BR-' || EXTRACT(YEAR FROM "createdAt")::TEXT || '-' || UPPER(SUBSTRING(REPLACE("id", '-', '') FROM 1 FOR 8))
WHERE "referenceNumber" IS NULL;