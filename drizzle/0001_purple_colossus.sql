CREATE TABLE `operational_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`industry` varchar(64) NOT NULL,
	`priority` enum('Low','Medium','High','Critical') NOT NULL,
	`description` text NOT NULL,
	`attachmentUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operational_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orchestration_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengeId` int NOT NULL,
	`classification` text NOT NULL,
	`activatedUnits` text NOT NULL,
	`recommendations` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orchestration_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `operational_challenges` ADD CONSTRAINT `operational_challenges_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orchestration_results` ADD CONSTRAINT `orchestration_results_challengeId_operational_challenges_id_fk` FOREIGN KEY (`challengeId`) REFERENCES `operational_challenges`(`id`) ON DELETE no action ON UPDATE no action;