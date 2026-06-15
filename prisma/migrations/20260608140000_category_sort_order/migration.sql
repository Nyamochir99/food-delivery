-- AlterTable
ALTER TABLE "FoodCategory" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) - 1 AS rn
  FROM "FoodCategory"
)
UPDATE "FoodCategory" AS fc
SET "sortOrder" = ranked.rn
FROM ranked
WHERE fc.id = ranked.id;
