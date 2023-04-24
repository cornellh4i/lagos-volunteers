-- AlterTable
ALTER TABLE "EventEnrollment" ADD COLUMN     "cancelationMessage" TEXT,
ADD COLUMN     "canceled" BOOLEAN DEFAULT false;
