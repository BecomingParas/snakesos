-- Keep the oldest payout request for each settlement before enforcing uniqueness.
DELETE FROM "payouts" older
USING "payouts" newer
WHERE older."settlementId" = newer."settlementId"
  AND (older."requestedAt", older."id") > (newer."requestedAt", newer."id");

-- A settlement represents one rescuer earning event and may have one payout request.
CREATE UNIQUE INDEX "payouts_settlementId_key" ON "payouts"("settlementId");