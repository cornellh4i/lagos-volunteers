-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "hours" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "EventEnrollment" ADD COLUMN     "customHours" INTEGER;
