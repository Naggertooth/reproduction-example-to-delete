/*
  Warnings:

  - Changed the type of `name` on the `RoleNames` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'GUEST');

BEGIN;

  -- AlterTable
  ALTER TABLE "RoleNames" DROP COLUMN "name",
    ADD COLUMN "name" "UserRole" NOT NULL DEFAULT 'GUEST';

  ALTER TABLE "RoleNames" ALTER COLUMN "name" DROP DEFAULT;

COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "RoleNames_name_key" ON "RoleNames"("name");
