/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `EventEnrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `EventEnrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `EventTags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EventEnrollment_eventId_key" ON "EventEnrollment"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventEnrollment_userId_key" ON "EventEnrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTags_id_key" ON "EventTags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
