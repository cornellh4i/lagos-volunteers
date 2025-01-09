/*
  Warnings:

  - The values [HOLD] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `subtitle` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `canceled` on the `EventEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `showedUp` on the `EventEnrollment` table. All the data in the column will be lost.
  - You are about to drop the column `disciplinaryNotices` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sendPromotions` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the `EventTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToEventTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- DropForeignKey
ALTER TABLE "_EventToEventTags" DROP CONSTRAINT "_EventToEventTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToEventTags" DROP CONSTRAINT "_EventToEventTags_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "subtitle";

-- AlterTable
ALTER TABLE "EventEnrollment" DROP COLUMN "canceled",
DROP COLUMN "showedUp";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "disciplinaryNotices",
DROP COLUMN "nickname";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hours",
DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "sendPromotions";

-- DropTable
DROP TABLE "EventTags";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "_EventToEventTags";
