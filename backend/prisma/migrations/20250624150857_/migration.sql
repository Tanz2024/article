-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "language" TEXT DEFAULT 'English',
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "timezone" TEXT DEFAULT 'UTC';
