-- DropIndex
DROP INDEX "Event_id_key";

-- DropIndex
DROP INDEX "EventEnrollment_eventId_key";

-- DropIndex
DROP INDEX "EventEnrollment_userId_key";

-- DropIndex
DROP INDEX "EventTags_id_key";

-- DropIndex
DROP INDEX "Permission_userId_key";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- DropIndex
DROP INDEX "User_id_key";

-- DropIndex
DROP INDEX "UserPreferences_userId_key";

-- AlterTable
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("userId");
