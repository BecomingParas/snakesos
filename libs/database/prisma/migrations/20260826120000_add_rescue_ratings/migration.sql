-- CreateTable
CREATE TABLE "rescue_ratings" (
    "id" TEXT NOT NULL,
    "rescueId" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "rescuerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rescue_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rescue_ratings_rescueId_key" ON "rescue_ratings"("rescueId");
CREATE INDEX "rescue_ratings_rescuerId_idx" ON "rescue_ratings"("rescuerId");
CREATE INDEX "rescue_ratings_citizenId_idx" ON "rescue_ratings"("citizenId");
CREATE INDEX "rescue_ratings_createdAt_idx" ON "rescue_ratings"("createdAt");

-- AddForeignKey
ALTER TABLE "rescue_ratings" ADD CONSTRAINT "rescue_ratings_rescueId_fkey" FOREIGN KEY ("rescueId") REFERENCES "rescue_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rescue_ratings" ADD CONSTRAINT "rescue_ratings_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rescue_ratings" ADD CONSTRAINT "rescue_ratings_rescuerId_fkey" FOREIGN KEY ("rescuerId") REFERENCES "volunteers"("id") ON DELETE CASCADE ON UPDATE CASCADE;