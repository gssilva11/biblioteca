/*
  Warnings:

  - You are about to drop the column `publisher_id` on the `Book` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_publisher_id_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "publisher_id";
