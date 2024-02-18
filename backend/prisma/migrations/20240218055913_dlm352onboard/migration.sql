/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT;
