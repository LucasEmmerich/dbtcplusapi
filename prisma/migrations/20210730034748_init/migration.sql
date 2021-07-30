-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user.email_unique`(`email`),
    UNIQUE INDEX `user.login_unique`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `glucose_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gl_per_dl` INTEGER NOT NULL,
    `was_there_consumption` BOOLEAN NOT NULL DEFAULT false,
    `consumption` VARCHAR(191),
    `insulin_doses_used` VARCHAR(191),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
