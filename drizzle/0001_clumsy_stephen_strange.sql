CREATE TABLE `notification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`level` text NOT NULL,
	`data` text NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `server` (
	`id` text PRIMARY KEY NOT NULL,
	`spec` text NOT NULL,
	`latestPing` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
