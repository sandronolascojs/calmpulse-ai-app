ALTER TABLE "workspaces" ADD COLUMN "is_disabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "deactivation_reason" "workspace_deactivation_reason";--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "deactivated_at" timestamp;