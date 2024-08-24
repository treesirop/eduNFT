CREATE TABLE `Admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `Admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NFTCollections` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`contractAddress` varchar(255) NOT NULL,
	`teacher_id` bigint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `NFTCollections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `NFTs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`token_id` int NOT NULL,
	`hash` varchar(255) NOT NULL,
	`ocid` varchar(255) NOT NULL,
	`user_id` bigint NOT NULL,
	`teacher_id` bigint NOT NULL,
	`collection_id` bigint NOT NULL,
	`minted_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `NFTs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Teachers` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `Teachers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userhash` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `Users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `NFTCollections` ADD CONSTRAINT `NFTCollections_teacher_id_Teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `Teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NFTs` ADD CONSTRAINT `NFTs_user_id_Users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NFTs` ADD CONSTRAINT `NFTs_teacher_id_Teachers_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `Teachers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `NFTs` ADD CONSTRAINT `NFTs_collection_id_NFTCollections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `NFTCollections`(`id`) ON DELETE no action ON UPDATE no action;