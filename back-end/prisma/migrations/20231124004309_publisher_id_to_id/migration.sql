/*
  Warnings:

  - The primary key for the `Publisher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_publisher` on the `Publisher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Publisher" DROP CONSTRAINT "Publisher_pkey",
DROP COLUMN "id_publisher",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id");
