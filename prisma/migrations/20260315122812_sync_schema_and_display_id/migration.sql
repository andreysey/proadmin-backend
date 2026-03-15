/*
  Warnings:

  - A unique constraint covering the columns `[displayId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayId" SERIAL NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_displayId_key" ON "User"("displayId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
