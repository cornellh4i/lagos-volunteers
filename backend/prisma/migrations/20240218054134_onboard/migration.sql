/*
  Warnings:

  - The values [VIRTUAL,IN_PERSON] on the enum `EventMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,ACTIVE,COMPLETED,CANCELED] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE,HOLD] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,VOLUNTEER,SUPERVISOR] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventMode_new" AS ENUM ('Virtual', 'In_Person');
ALTER TABLE "Event" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "mode" TYPE "EventMode_new" USING ("mode"::text::"EventMode_new");
ALTER TYPE "EventMode" RENAME TO "EventMode_old";
ALTER TYPE "EventMode_new" RENAME TO "EventMode";
DROP TYPE "EventMode_old";
ALTER TABLE "Event" ALTER COLUMN "mode" SET DEFAULT 'In_Person';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('Draft', 'Active', 'Completed', 'Canceled');
ALTER TABLE "Event" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('Active', 'Inactive', 'Hold');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('Admin', 'Volunteer', 'Supervisor');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "userRole_new" USING ("role"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "userRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Volunteer';
COMMIT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'Draft',
ALTER COLUMN "mode" SET DEFAULT 'In_Person';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Volunteer',
ALTER COLUMN "status" SET DEFAULT 'Active';
