ALTER TABLE "rescue_requests" ADD COLUMN "publicIdempotencyKey" TEXT;

CREATE UNIQUE INDEX "rescue_requests_publicIdempotencyKey_key"
ON "rescue_requests"("publicIdempotencyKey");