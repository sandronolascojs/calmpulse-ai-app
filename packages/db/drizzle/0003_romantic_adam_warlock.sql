ALTER TABLE "workspace_members" ADD COLUMN "external_id" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_member_workspace_external_id_unique_idx" ON "workspace_members" USING btree ("workspace_id","external_id");--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_external_id_unique" UNIQUE("external_id");