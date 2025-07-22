CREATE TYPE "slack_event_types" AS ENUM ('TEAM_JOIN', 'MESSAGE', 'APP_MENTION', 'MEMBER_JOINED_CHANNEL');--> statement-breakpoint
ALTER TABLE "slack_temporal_raw_events" RENAME COLUMN "text" TO "payload";--> statement-breakpoint
ALTER TABLE "slack_temporal_raw_events" ADD COLUMN "type" "slack_event_types" NOT NULL;--> statement-breakpoint
ALTER TABLE "slack_temporal_raw_events" ALTER COLUMN "payload" TYPE jsonb USING payload::jsonb;--> statement-breakpoint
CREATE INDEX "slack_temporal_raw_events_type_idx" ON "slack_temporal_raw_events" USING btree ("type");