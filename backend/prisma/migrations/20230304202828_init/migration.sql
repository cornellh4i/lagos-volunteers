/*
  Warnings:

  - The values [CANCELLED] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `EndDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `EndTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `StartDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `StartTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `disciplinaryNotices` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Event` table. All the data in the column will be lost.
  - The `mode` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('ADMIN', 'VOLUNTEER', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'HOLD');

-- CreateEnum
CREATE TYPE "EventMode" AS ENUM ('VIRTUAL', 'IN_PERSON');

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

-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_userId_fkey";

-- DropForeignKey
ALTER TABLE "_EventToTags" DROP CONSTRAINT "_EventToTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToTags" DROP CONSTRAINT "_EventToTags_B_fkey";

-- DropForeignKey
ALTER TABLE "eventEnrollment" DROP CONSTRAINT "eventEnrollment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "eventEnrollment" DROP CONSTRAINT "eventEnrollment_userId_fkey";

-- DropIndex
DROP INDEX "Event_ownerId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "EndDate",
DROP COLUMN "EndTime",
DROP COLUMN "StartDate",
DROP COLUMN "StartTime",
DROP COLUMN "disciplinaryNotices",
DROP COLUMN "image",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "mode",
ADD COLUMN     "mode" "EventMode" DEFAULT 'IN_PERSON',
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "image",
DROP COLUMN "lastName",
DROP COLUMN "nickname",
DROP COLUMN "role",
ADD COLUMN     "role" "userRole" DEFAULT 'VOLUNTEER',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" DEFAULT 'ACTIVE',
ALTER COLUMN "verified" DROP NOT NULL;

-- DropTable
DROP TABLE "Preference";

-- DropTable
DROP TABLE "Tags";

-- DropTable
DROP TABLE "_EventToTags";

-- DropTable
DROP TABLE "eventEnrollment";

-- DropEnum
DROP TYPE "Mode";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Profile" (
    "firstName" TEXT,
    "lastName" TEXT,
    "nickname" TEXT,
    "imageURL" TEXT,
    "disciplinaryNotices" INTEGER DEFAULT 0,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "userId" TEXT NOT NULL,
    "sendEmailNotification" BOOLEAN NOT NULL DEFAULT true,
    "sendPromotions" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Permission" (
    "userId" TEXT NOT NULL,
    "canCreateEvent" BOOLEAN NOT NULL DEFAULT false,
    "canEditEvent" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteEvent" BOOLEAN NOT NULL DEFAULT false,
    "canAssignRoles" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "EventTags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventEnrollment" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showedUp" BOOLEAN DEFAULT false,
    "workedHours" INTEGER DEFAULT 0,

    CONSTRAINT "EventEnrollment_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "_EventToEventTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_userId_key" ON "Permission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTags_id_key" ON "EventTags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EventEnrollment_eventId_key" ON "EventEnrollment"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventEnrollment_userId_key" ON "EventEnrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToEventTags_AB_unique" ON "_EventToEventTags"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToEventTags_B_index" ON "_EventToEventTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEnrollment" ADD CONSTRAINT "EventEnrollment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventEnrollment" ADD CONSTRAINT "EventEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTags" ADD CONSTRAINT "_EventToEventTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTags" ADD CONSTRAINT "_EventToEventTags_B_fkey" FOREIGN KEY ("B") REFERENCES "EventTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
