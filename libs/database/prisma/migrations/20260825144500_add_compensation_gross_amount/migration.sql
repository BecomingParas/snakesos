-- AlterTable
ALTER TABLE "compensation_policies" ADD COLUMN     "grossAmount" DECIMAL(12,2) NOT NULL;

INSERT INTO "compensation_policies" (
	"id",
	"name",
	"currency",
	"grossAmount",
	"fixedAmount",
	"commissionRate",
	"effectiveFrom",
	"isActive",
	"createdAt",
	"updatedAt"
)
SELECT
	'00000000-0000-0000-0000-000000000001',
	'Standard rescue policy v1',
	'NPR',
	1000.00,
	500.00,
	20.00,
	CURRENT_TIMESTAMP,
	true,
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP
WHERE NOT EXISTS (
	SELECT 1 FROM "compensation_policies"
	WHERE "name" = 'Standard rescue policy v1'
);
