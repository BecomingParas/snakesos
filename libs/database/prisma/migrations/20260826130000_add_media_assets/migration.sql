-- CreateEnum
CREATE TYPE "MediaProvider" AS ENUM ('CLOUDINARY');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'UPLOADED', 'VERIFIED', 'REJECTED', 'DELETED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('RESCUER_PROFILE_IMAGE', 'RESCUER_VERIFICATION_DOCUMENT');

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "provider" "MediaProvider" NOT NULL DEFAULT 'CLOUDINARY',
    "publicId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL DEFAULT 'image',
    "originalFileName" TEXT,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_publicId_key" ON "media_assets"("publicId");
CREATE INDEX "media_assets_ownerId_idx" ON "media_assets"("ownerId");
CREATE INDEX "media_assets_mediaType_idx" ON "media_assets"("mediaType");
CREATE INDEX "media_assets_status_idx" ON "media_assets"("status");

-- AddForeignKey
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;