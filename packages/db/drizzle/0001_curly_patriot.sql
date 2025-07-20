ALTER TABLE "workspace_members" ALTER COLUMN "name" SET DATA TYPE varchar(400);--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "name" SET DATA TYPE varchar(400);--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "slug" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "domain" SET DATA TYPE varchar(255);