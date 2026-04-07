/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId,departmentId]` on the table `EventRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EventRequest" ADD COLUMN     "departmentId" TEXT,
ALTER COLUMN "ministryRole" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventRequest_userId_eventId_departmentId_key" ON "EventRequest"("userId", "eventId", "departmentId");

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
