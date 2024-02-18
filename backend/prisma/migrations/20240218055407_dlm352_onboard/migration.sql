/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "imageURL" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "followers" DROP NOT NULL,
ALTER COLUMN "following" DROP NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId");
