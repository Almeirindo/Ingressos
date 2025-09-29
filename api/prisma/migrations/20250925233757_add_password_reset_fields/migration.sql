-- AlterTable
ALTER TABLE `users` ADD COLUMN `reset_expires` DATETIME(3) NULL,
    ADD COLUMN `reset_token` VARCHAR(191) NULL;
