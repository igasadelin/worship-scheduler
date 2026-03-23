-- CreateEnum
CREATE TYPE "BlackoutType" AS ENUM ('MORNING', 'EVENING', 'ALL_DAY');

-- CreateTable
CREATE TABLE "Blackout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "serviceType" "BlackoutType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blackout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blackout" ADD CONSTRAINT "Blackout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
