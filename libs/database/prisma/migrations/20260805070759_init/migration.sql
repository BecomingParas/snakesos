-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'VOLUNTEER', 'VERIFIED_RESCUER', 'DISTRICT_COORDINATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'BANNED');

-- CreateEnum
CREATE TYPE "RescueStatus" AS ENUM ('PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RescuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RescueOutcome" AS ENUM ('RESCUED_RELOCATED', 'ALREADY_GONE', 'FALSE_ALARM', 'NO_SNAKE_FOUND', 'DECEASED', 'REFUSED_HELP');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('PENDING', 'APPROVED', 'VERIFIED', 'SUSPENDED', 'REJECTED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DangerLevel" AS ENUM ('HARMLESS', 'MILDLY_VENOMOUS', 'MEDICALLY_SIGNIFICANT', 'HIGHLY_DANGEROUS');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ESEWA', 'KHALTI', 'IME_PAY', 'FONEPAY', 'BANK_TRANSFER', 'STRIPE', 'PAYPAL', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RESCUE_CREATED', 'RESCUE_ASSIGNED', 'RESCUE_ACCEPTED', 'RESCUE_COMPLETED', 'RESCUE_CANCELLED', 'VOLUNTEER_APPROVED', 'VOLUNTEER_REJECTED', 'TRAINING_SCHEDULED', 'TRAINING_REMINDER', 'DONATION_RECEIVED', 'SYSTEM_ALERT', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CITIZEN',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "googleId" TEXT,
    "googleEmail" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiry" TIMESTAMP(3),
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
    "notificationPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rescue_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "municipality" TEXT NOT NULL,
    "ward" INTEGER,
    "address" TEXT NOT NULL,
    "landmark" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "locationAccuracy" DOUBLE PRECISION,
    "snakeDescription" TEXT,
    "snakeSize" TEXT,
    "snakeColor" TEXT,
    "snakeImageUrl" TEXT,
    "snakeImages" TEXT[],
    "speciesId" TEXT,
    "aiIdentificationId" TEXT,
    "status" "RescueStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "RescuePriority" NOT NULL DEFAULT 'MEDIUM',
    "stillPresent" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "internalNotes" TEXT,
    "assignedTo" TEXT,
    "assignedAt" TIMESTAMP(3),
    "assignedBy" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "outcome" "RescueOutcome",
    "rescueReport" TEXT,
    "rescueImages" TEXT[],
    "rescueDuration" INTEGER,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "emergencyDetails" TEXT,
    "hasBite" BOOLEAN NOT NULL DEFAULT false,
    "biteDetails" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEB',
    "referenceNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "rescue_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rescue_timelines" (
    "id" TEXT NOT NULL,
    "rescueId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "userId" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rescue_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "ward" INTEGER,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "experience" TEXT NOT NULL,
    "experienceYears" INTEGER,
    "vehicle" TEXT NOT NULL,
    "vehicleDetails" TEXT,
    "skills" TEXT[],
    "certifications" TEXT[],
    "languages" TEXT[] DEFAULT ARRAY['Nepali', 'English']::TEXT[],
    "availableTime" TEXT NOT NULL,
    "availableDays" TEXT[],
    "emergencyAvailability" BOOLEAN NOT NULL DEFAULT true,
    "isAvailableNow" BOOLEAN NOT NULL DEFAULT false,
    "assignedZone" TEXT,
    "coverageRadius" INTEGER DEFAULT 5,
    "currentLat" DOUBLE PRECISION,
    "currentLng" DOUBLE PRECISION,
    "lastLocationUpdate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "bio" TEXT,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectionReason" TEXT,
    "totalRescues" INTEGER NOT NULL DEFAULT 0,
    "completedRescues" INTEGER NOT NULL DEFAULT 0,
    "cancelledRescues" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "averageResponseTime" INTEGER,
    "averageRescueTime" INTEGER,
    "rating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "trainingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingDate" TIMESTAMP(3),
    "certificationExpiry" TIMESTAMP(3),
    "hasEquipment" BOOLEAN NOT NULL DEFAULT false,
    "equipment" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "instructor" TEXT,
    "maxParticipants" INTEGER NOT NULL DEFAULT 20,
    "registeredCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "materials" TEXT[],
    "certificate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snake_species" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "nepaliName" TEXT NOT NULL,
    "localNames" TEXT[],
    "aliases" TEXT[],
    "family" TEXT,
    "genus" TEXT,
    "species" TEXT,
    "venomous" BOOLEAN NOT NULL DEFAULT false,
    "dangerLevel" "DangerLevel",
    "venomType" TEXT,
    "averageLength" TEXT,
    "maxLength" TEXT,
    "color" TEXT,
    "pattern" TEXT,
    "identificationGuide" TEXT,
    "distinctiveFeatures" TEXT[],
    "behavior" TEXT,
    "habitat" TEXT,
    "activeTime" TEXT,
    "diet" TEXT,
    "safetyTips" TEXT,
    "emergencyAdvice" TEXT,
    "firstAidSteps" TEXT[],
    "foundInNepal" BOOLEAN NOT NULL DEFAULT true,
    "regions" TEXT[],
    "altitudeRange" TEXT,
    "conservationStatus" TEXT,
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "images" TEXT[],
    "videoUrl" TEXT,
    "rescueCount" INTEGER NOT NULL DEFAULT 0,
    "identificationCount" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "snake_species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_identifications" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageThumbnail" TEXT,
    "uploadSource" TEXT NOT NULL DEFAULT 'WEB',
    "speciesId" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "alternativeMatches" JSONB,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptUsed" TEXT,
    "responseTime" INTEGER,
    "venomousDetected" BOOLEAN,
    "dangerAssessment" TEXT,
    "colorDetected" TEXT[],
    "sizeEstimate" TEXT,
    "userId" TEXT,
    "userFeedback" TEXT,
    "correctSpeciesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_identifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL DEFAULT 'News',
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "images" TEXT[],
    "videoUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "commentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "rescueId" TEXT,
    "speciesId" TEXT,
    "uploadedBy" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "fileSize" INTEGER,
    "dimensions" TEXT,
    "format" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "donorId" TEXT,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT,
    "donorPhone" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "amountUSD" DOUBLE PRECISION,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentGateway" TEXT NOT NULL,
    "transactionId" TEXT,
    "gatewayResponse" JSONB,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "purpose" TEXT,
    "campaign" TEXT,
    "message" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "receiptNumber" TEXT,
    "receiptUrl" TEXT,
    "invoiceUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "verificationNotes" TEXT,
    "refundedAt" TIMESTAMP(3),
    "refundReason" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "actionUrl" TEXT,
    "sentViaApp" BOOLEAN NOT NULL DEFAULT true,
    "sentViaEmail" BOOLEAN NOT NULL DEFAULT false,
    "sentViaSMS" BOOLEAN NOT NULL DEFAULT false,
    "sentViaTelegram" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "rescueId" TEXT,
    "metadata" JSONB,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "responded" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3),
    "response" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "method" TEXT,
    "url" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'STRING',
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TrainingToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TrainingToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TrainingToVolunteer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TrainingToVolunteer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "rescue_requests_aiIdentificationId_key" ON "rescue_requests"("aiIdentificationId");

-- CreateIndex
CREATE UNIQUE INDEX "rescue_requests_referenceNumber_key" ON "rescue_requests"("referenceNumber");

-- CreateIndex
CREATE INDEX "rescue_requests_status_idx" ON "rescue_requests"("status");

-- CreateIndex
CREATE INDEX "rescue_requests_priority_idx" ON "rescue_requests"("priority");

-- CreateIndex
CREATE INDEX "rescue_requests_municipality_idx" ON "rescue_requests"("municipality");

-- CreateIndex
CREATE INDEX "rescue_requests_assignedTo_idx" ON "rescue_requests"("assignedTo");

-- CreateIndex
CREATE INDEX "rescue_requests_createdAt_idx" ON "rescue_requests"("createdAt");

-- CreateIndex
CREATE INDEX "rescue_requests_userId_idx" ON "rescue_requests"("userId");

-- CreateIndex
CREATE INDEX "rescue_requests_speciesId_idx" ON "rescue_requests"("speciesId");

-- CreateIndex
CREATE INDEX "rescue_timelines_rescueId_idx" ON "rescue_timelines"("rescueId");

-- CreateIndex
CREATE INDEX "rescue_timelines_createdAt_idx" ON "rescue_timelines"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_userId_key" ON "volunteers"("userId");

-- CreateIndex
CREATE INDEX "volunteers_status_idx" ON "volunteers"("status");

-- CreateIndex
CREATE INDEX "volunteers_municipality_idx" ON "volunteers"("municipality");

-- CreateIndex
CREATE INDEX "volunteers_isAvailableNow_idx" ON "volunteers"("isAvailableNow");

-- CreateIndex
CREATE INDEX "volunteers_userId_idx" ON "volunteers"("userId");

-- CreateIndex
CREATE INDEX "trainings_scheduledAt_idx" ON "trainings"("scheduledAt");

-- CreateIndex
CREATE INDEX "trainings_status_idx" ON "trainings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "snake_species_name_key" ON "snake_species"("name");

-- CreateIndex
CREATE UNIQUE INDEX "snake_species_scientificName_key" ON "snake_species"("scientificName");

-- CreateIndex
CREATE INDEX "snake_species_venomous_idx" ON "snake_species"("venomous");

-- CreateIndex
CREATE INDEX "snake_species_dangerLevel_idx" ON "snake_species"("dangerLevel");

-- CreateIndex
CREATE INDEX "snake_species_family_idx" ON "snake_species"("family");

-- CreateIndex
CREATE INDEX "ai_identifications_speciesId_idx" ON "ai_identifications"("speciesId");

-- CreateIndex
CREATE INDEX "ai_identifications_userId_idx" ON "ai_identifications"("userId");

-- CreateIndex
CREATE INDEX "ai_identifications_provider_idx" ON "ai_identifications"("provider");

-- CreateIndex
CREATE INDEX "ai_identifications_createdAt_idx" ON "ai_identifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_idx" ON "blog_posts"("status");

-- CreateIndex
CREATE INDEX "blog_posts_category_idx" ON "blog_posts"("category");

-- CreateIndex
CREATE INDEX "blog_posts_authorId_idx" ON "blog_posts"("authorId");

-- CreateIndex
CREATE INDEX "blog_posts_publishedAt_idx" ON "blog_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "gallery_images_category_idx" ON "gallery_images"("category");

-- CreateIndex
CREATE INDEX "gallery_images_uploadedBy_idx" ON "gallery_images"("uploadedBy");

-- CreateIndex
CREATE INDEX "gallery_images_isPublic_idx" ON "gallery_images"("isPublic");

-- CreateIndex
CREATE INDEX "gallery_images_isFeatured_idx" ON "gallery_images"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "donations_transactionId_key" ON "donations"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_receiptNumber_key" ON "donations"("receiptNumber");

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donations"("status");

-- CreateIndex
CREATE INDEX "donations_paymentMethod_idx" ON "donations"("paymentMethod");

-- CreateIndex
CREATE INDEX "donations_donorId_idx" ON "donations"("donorId");

-- CreateIndex
CREATE INDEX "donations_createdAt_idx" ON "donations"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE INDEX "contact_messages_category_idx" ON "contact_messages"("category");

-- CreateIndex
CREATE INDEX "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_entity_entityId_idx" ON "activity_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE INDEX "system_settings_category_idx" ON "system_settings"("category");

-- CreateIndex
CREATE INDEX "_TrainingToUser_B_index" ON "_TrainingToUser"("B");

-- CreateIndex
CREATE INDEX "_TrainingToVolunteer_B_index" ON "_TrainingToVolunteer"("B");

-- AddForeignKey
ALTER TABLE "rescue_requests" ADD CONSTRAINT "rescue_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_requests" ADD CONSTRAINT "rescue_requests_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "snake_species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_requests" ADD CONSTRAINT "rescue_requests_aiIdentificationId_fkey" FOREIGN KEY ("aiIdentificationId") REFERENCES "ai_identifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_requests" ADD CONSTRAINT "rescue_requests_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "volunteers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_timelines" ADD CONSTRAINT "rescue_timelines_rescueId_fkey" FOREIGN KEY ("rescueId") REFERENCES "rescue_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rescue_timelines" ADD CONSTRAINT "rescue_timelines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_identifications" ADD CONSTRAINT "ai_identifications_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "snake_species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_identifications" ADD CONSTRAINT "ai_identifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_rescueId_fkey" FOREIGN KEY ("rescueId") REFERENCES "rescue_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingToUser" ADD CONSTRAINT "_TrainingToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingToUser" ADD CONSTRAINT "_TrainingToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingToVolunteer" ADD CONSTRAINT "_TrainingToVolunteer_A_fkey" FOREIGN KEY ("A") REFERENCES "trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainingToVolunteer" ADD CONSTRAINT "_TrainingToVolunteer_B_fkey" FOREIGN KEY ("B") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
