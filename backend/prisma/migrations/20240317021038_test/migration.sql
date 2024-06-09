-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'CHECKED_IN', 'CHECKED_OUT', 'REMOVED', 'CANCELED');

-- AlterTable
ALTER TABLE "EventEnrollment" ADD COLUMN     "attendeeStatus" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING';
