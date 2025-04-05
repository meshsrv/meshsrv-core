CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`passwordHash` text NOT NULL,
	`nickname` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);