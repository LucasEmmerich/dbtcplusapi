-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_login_key`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `glucose_record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mg_per_dl` INTEGER NOT NULL,
    `was_there_consumption` BOOLEAN NOT NULL DEFAULT false,
    `consumption` VARCHAR(191) NULL,
    `insulin_doses_used` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `glucose_record` ADD CONSTRAINT `glucose_record_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
