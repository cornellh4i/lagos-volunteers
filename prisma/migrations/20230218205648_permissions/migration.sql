/*
  Warnings:

  - You are about to drop the column `canAssignRoles` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `canCreateEvent` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `canDeleteEvent` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `canEditEvent` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "canAssignRoles",
DROP COLUMN "canCreateEvent",
DROP COLUMN "canDeleteEvent",
DROP COLUMN "canEditEvent";

-- CreateTable
CREATE TABLE "Permission" (
    "roleId" TEXT NOT NULL,
    "canCreateEvent" BOOLEAN NOT NULL DEFAULT false,
    "canEditEvent" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteEvent" BOOLEAN NOT NULL DEFAULT false,
    "canAssignRoles" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_key" ON "Permission"("roleId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
