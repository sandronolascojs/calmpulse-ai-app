CREATE TYPE "public"."slack_event_types" AS ENUM('TEAM_JOIN', 'MESSAGE', 'APP_MENTION', 'MEMBER_JOINED_CHANNEL', 'DND_UPDATED_USER');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('OWNER', 'USER');--> statement-breakpoint
CREATE TYPE "public"."workspace_external_provider_type" AS ENUM('SLACK', 'MICROSOFT_TEAMS');