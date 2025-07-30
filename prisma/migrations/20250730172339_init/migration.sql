-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'guide');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
