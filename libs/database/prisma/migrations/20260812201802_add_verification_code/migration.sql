-- AlterTable
ALTER TABLE "verifications" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE INDEX "verifications_code_idx" ON "verifications"("code");
