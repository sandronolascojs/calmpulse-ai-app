--> enums
CREATE TYPE "user_roles" AS ENUM ('OWNER', 'USER');
CREATE TYPE "workspace_external_provider_type" AS ENUM ('SLACK', 'MICROSOFT_TEAMS', 'GOOGLE_CALENDAR');

--> tables
CREATE TABLE "daily_features" (
	"workspace_member_id" text NOT NULL,
	"day" date NOT NULL,
	"after_hours_messages" integer DEFAULT 0 NOT NULL,
	"negative_messages" integer DEFAULT 0 NOT NULL,
	"meeting_minutes" integer DEFAULT 0 NOT NULL,
	"long_breaks" integer DEFAULT 0 NOT NULL,
	"positive_messages" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_features_workspace_member_id_day_pk" PRIMARY KEY("workspace_member_id","day")
);
--> statement-breakpoint
CREATE TABLE "fatigue_scores" (
	"fatigue_score_id" text PRIMARY KEY NOT NULL,
	"workspace_member_id" text NOT NULL,
	"day" date NOT NULL,
	"fatigue_index" real NOT NULL,
	"label" text NOT NULL,
	"advice" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fatigue_scores_fatigue_score_id_unique" UNIQUE("fatigue_score_id")
);
--> statement-breakpoint
CREATE TABLE "slack_oauth_store_state" (
	"oauth_store_state_id" text PRIMARY KEY NOT NULL,
	"state" text NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "slack_oauth_store_state_oauth_store_state_id_unique" UNIQUE("oauth_store_state_id"),
	CONSTRAINT "slack_oauth_store_state_state_unique" UNIQUE("state")
);
--> statement-breakpoint
CREATE TABLE "slack_temporal_raw_events" (
	"slack_temporal_raw_event_id" text PRIMARY KEY NOT NULL,
	"slack_event_id" text NOT NULL,
	"workspace_member_id" text NOT NULL,
	"text" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "slack_temporal_raw_events_slack_temporal_raw_event_id_unique" UNIQUE("slack_temporal_raw_event_id")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_id_unique" UNIQUE("id"),
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user_workspaces" (
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"role" "user_roles" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_google_calendar_integrations" (
	"workspace_google_calendar_integration_id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"google_customer_id" text,
	"calendar_installed" boolean DEFAULT false NOT NULL,
	"calendar_installation_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_google_calendar_integrations_workspace_google_calendar_integration_id_unique" UNIQUE("workspace_google_calendar_integration_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_google_calendar_sync_tokens" (
	"workspace_google_calendar_sync_token_id" text PRIMARY KEY NOT NULL,
	"workspace_member_id" text NOT NULL,
	"sync_token" text NOT NULL,
	"last_synced_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_google_calendar_sync_tokens_workspace_google_calendar_sync_token_id_unique" UNIQUE("workspace_google_calendar_sync_token_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_google_calendar_watch_channels" (
	"watch_id" text PRIMARY KEY NOT NULL,
	"workspace_member_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"resource_id" text NOT NULL,
	"expiration" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_google_calendar_watch_channels_watch_id_unique" UNIQUE("watch_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_member_id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"title" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_member_id_unique" UNIQUE("workspace_member_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"workspace_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"external_id" text NOT NULL,
	"domain" text,
	"external_provider_type" "workspace_external_provider_type" DEFAULT 'SLACK' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_tokens" (
	"token_id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"provider" "workspace_external_provider_type" DEFAULT 'SLACK' NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp,
	"installer_user_id" text,
	"installed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_tokens_token_id_unique" UNIQUE("token_id"),
	CONSTRAINT "workspace_tokens_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
CREATE TABLE "interventions" (
	"intervention_id" text PRIMARY KEY NOT NULL,
	"workspace_member_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"type" text NOT NULL,
	"details" text,
	"acknowledged" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interventions_intervention_id_unique" UNIQUE("intervention_id")
);
--> statement-breakpoint
ALTER TABLE "daily_features" ADD CONSTRAINT "daily_features_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fatigue_scores" ADD CONSTRAINT "fatigue_scores_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slack_oauth_store_state" ADD CONSTRAINT "slack_oauth_store_state_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slack_temporal_raw_events" ADD CONSTRAINT "slack_temporal_raw_events_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_google_calendar_integrations" ADD CONSTRAINT "workspace_google_calendar_integrations_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_google_calendar_sync_tokens" ADD CONSTRAINT "workspace_google_calendar_sync_tokens_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_google_calendar_watch_channels" ADD CONSTRAINT "workspace_google_calendar_watch_channels_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_tokens" ADD CONSTRAINT "workspace_tokens_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_tokens" ADD CONSTRAINT "workspace_tokens_installer_user_id_users_id_fk" FOREIGN KEY ("installer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_workspace_member_id_workspace_members_workspace_member_id_fk" FOREIGN KEY ("workspace_member_id") REFERENCES "public"."workspace_members"("workspace_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_member_id_idx" ON "daily_features" USING btree ("workspace_member_id");--> statement-breakpoint
CREATE INDEX "workspace_member_id_fatigue_score_id_idx" ON "fatigue_scores" USING btree ("workspace_member_id","fatigue_score_id");--> statement-breakpoint
CREATE INDEX "slack_temporal_raw_events_slack_event_id_idx" ON "slack_temporal_raw_events" USING btree ("slack_event_id");--> statement-breakpoint
CREATE INDEX "slack_temporal_raw_events_workspace_member_id_idx" ON "slack_temporal_raw_events" USING btree ("workspace_member_id");--> statement-breakpoint
CREATE INDEX "user_workspaces_user_id_idx" ON "user_workspaces" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_workspaces_workspace_id_idx" ON "user_workspaces" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_google_calendar_integration_workspace_id_idx" ON "workspace_google_calendar_integrations" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_google_calendar_sync_token_workspace_member_id_idx" ON "workspace_google_calendar_sync_tokens" USING btree ("workspace_member_id");--> statement-breakpoint
CREATE INDEX "workspace_google_calendar_watch_channels_workspace_member_id_idx" ON "workspace_google_calendar_watch_channels" USING btree ("workspace_member_id");--> statement-breakpoint
CREATE INDEX "workspace_member_workspace_id_idx" ON "workspace_members" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_tokens_workspace_id_idx" ON "workspace_tokens" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspace_member_id_intervention_id_idx" ON "interventions" USING btree ("workspace_member_id","intervention_id");