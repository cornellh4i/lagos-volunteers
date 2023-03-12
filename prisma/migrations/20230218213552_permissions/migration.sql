/*
  Warnings:

  - You are about to drop the column `roleId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropIndex
DROP INDEX "Permission_roleId_key";

-- DropIndex
DROP INDEX "User_roleId_key";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "roleId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "role" "userRole" DEFAULT 'VOLUNTEER';

-- DropTable
DROP TABLE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Permission_userId_key" ON "Permission"("userId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
