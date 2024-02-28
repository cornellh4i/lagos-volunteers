/*
  Warnings:

  - The values [Virtual,In_Person] on the enum `EventMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [Draft,Active,Completed,Canceled] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Active,Inactive,Hold] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Admin,Volunteer,Supervisor] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventMode_new" AS ENUM ('VIRTUAL', 'IN_PERSON');
ALTER TABLE "Event" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "mode" TYPE "EventMode_new" USING ("mode"::text::"EventMode_new");
ALTER TYPE "EventMode" RENAME TO "EventMode_old";
ALTER TYPE "EventMode_new" RENAME TO "EventMode";
DROP TYPE "EventMode_old";
ALTER TABLE "Event" ALTER COLUMN "mode" SET DEFAULT 'IN_PERSON';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELED');
ALTER TABLE "Event" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'HOLD');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('ADMIN', 'VOLUNTEER', 'SUPERVISOR');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "userRole_new" USING ("role"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "userRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VOLUNTEER';
COMMIT;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "mode" SET DEFAULT 'IN_PERSON';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VOLUNTEER',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
