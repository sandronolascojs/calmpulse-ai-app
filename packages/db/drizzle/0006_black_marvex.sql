CREATE TYPE "locale" AS ENUM ('en_US', 'es_ES', 'fr_FR', 'de_DE', 'it_IT', 'pt_PT', 'ru_RU', 'zh_CN', 'ja_JP', 'ko_KR', 'pt_BR', 'ar_SA', 'zh_TW', 'nl_NL', 'pl_PL', 'sv_SE', 'tr_TR', 'uk_UA', 'vi_VN', 'id_ID', 'ms_MY', 'th_TH', 'ms_SG');--> statement-breakpoint
CREATE TABLE "workspace_member_preferences" (
	"workspace_member_preferences_id" text PRIMARY KEY NOT NULL,
	"workspace_member_id" text NOT NULL,
	"timezone" text NOT NULL,
	"locale" "locale" DEFAULT 'en_US' NOT NULL,
	"is_dnd_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_member_preferences_workspace_member_preferences_id_unique" UNIQUE("workspace_member_preferences_id")
);
--> statement-breakpoint
ALTER TABLE "workspace_member_preferences" ADD CONSTRAINT "workspace_member_preferences_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_member_preferences_workspace_member_id_unique_idx" ON "workspace_member_preferences" USING btree ("workspace_member_id");