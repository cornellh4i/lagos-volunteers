/*
  Warnings:

  - You are about to drop the `AboutPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AboutPage";

-- CreateTable
CREATE TABLE "About" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);
