/*
  Warnings:

  - You are about to drop the column `price` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `price`,
    ADD COLUMN `normal_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `vip_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;
