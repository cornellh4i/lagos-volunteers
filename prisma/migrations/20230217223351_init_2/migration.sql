/*
  Warnings:

  - You are about to drop the column `disciplinaryNotices` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_profileId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "disciplinaryNotices",
DROP COLUMN "image",
ADD COLUMN     "imageURL" TEXT;

-- AlterTable
ALTER TABLE "EventEnrollment" ALTER COLUMN "showedUp" DROP NOT NULL,
ALTER COLUMN "showedUp" SET DEFAULT false,
ALTER COLUMN "workedHours" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "disciplinaryNotices" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileId";

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "sendPromotions" BOOLEAN NOT NULL DEFAULT false;
