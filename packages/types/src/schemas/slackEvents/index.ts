import { z } from 'zod';

// — Slack wrapper event object for all events
const SlackBaseSchema = z.object({
  token: z.string(),
  team_id: z.string(),
  api_app_id: z.string(),
  type: z.union([
    z.literal('url_verification'),
    z.literal('event_callback'),
    z.literal('app_rate_limited'),
  ]),
  challenge: z.string().optional(),
  event_id: z.string().optional(),
  event_time: z.number().optional(),
  authorizations: z
    .array(
      z.object({
        enterprise_id: z.string().nullable(),
        team_id: z.string(),
        user_id: z.string(),
        is_bot: z.boolean(),
        is_enterprise_install: z.boolean().optional(),
      }),
    )
    .optional(),
  event_context: z.string().optional(),
});

// — Slack user profile
export const SlackUserProfileSchema = z.object({
  title: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  skype: z.string().nullable().optional(),
  real_name: z.string().optional(),
  real_name_normalized: z.string().optional(),
  display_name: z.string().optional(),
  display_name_normalized: z.string().optional(),
  fields: z.record(z.any()).optional(),
  status_text: z.string().optional(),
  status_emoji: z.string().optional(),
  status_emoji_display_info: z.array(z.any()).optional(),
  status_expiration: z.number().optional(),
  avatar_hash: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  image_24: z.string().url().optional(),
  image_32: z.string().url().optional(),
  image_48: z.string().url().optional(),
  image_72: z.string().url().optional(),
  image_192: z.string().url().optional(),
  image_512: z.string().url().optional(),
  team: z.string().optional(),
});

// — Base event
const BaseEvent = z.object({
  type: z.string(),
  event_ts: z.string().optional(),
  ts: z.string().optional(),
});

// — Event team join
export const TeamJoinEventSchema = z.object({
  type: z.literal('team_join'),
  user: z.object({
    id: z.string(),
    team_id: z.string(),
    name: z.string(),
    deleted: z.boolean(),
    color: z.string().optional(),
    real_name: z.string().optional(),
    tz: z.string().optional(),
    tz_label: z.string().optional(),
    tz_offset: z.number().optional(),
    profile: SlackUserProfileSchema,
    is_admin: z.boolean().optional(),
    is_owner: z.boolean().optional(),
    is_primary_owner: z.boolean().optional(),
    is_restricted: z.boolean().optional(),
    is_ultra_restricted: z.boolean().optional(),
    is_bot: z.boolean().optional(),
    is_app_user: z.boolean().optional(),
    updated: z.number().optional(),
    is_email_confirmed: z.boolean().optional(),
    who_can_share_contact_card: z.string().optional(),
    presence: z.string().optional(),
  }),
  cache_ts: z.number().optional(),
  event_ts: z.string().optional(),
});

// — Event message
export const MessageEventSchema = BaseEvent.extend({
  type: z.literal('message'),
  subtype: z.string().optional(),
  user: z.string().optional(),
  bot_id: z.string().optional(),
  text: z.string().optional(),
  channel: z.string(),
  ts: z.string(),
  thread_ts: z.string().optional(),
  edited: z.object({ user: z.string(), ts: z.string() }).optional(),
  hidden: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  pinned_to: z.array(z.string()).optional(),
  reactions: z
    .array(
      z.object({
        name: z.string(),
        count: z.number(),
        users: z.array(z.string()),
      }),
    )
    .optional(),
});

// — Event app mention
export const AppMentionEventSchema = BaseEvent.extend({
  type: z.literal('app_mention'),
  user: z.string(),
  text: z.string(),
  channel: z.string(),
  ts: z.string(),
});

// — Event member joined channel
export const MemberJoinedChannelEventSchema = BaseEvent.extend({
  type: z.literal('member_joined_channel'),
  user: z.string(),
  channel: z.string(),
  channel_type: z.string(),
  team: z.string(),
  inviter: z.string().optional(),
  enterprise: z.string().optional(),
  event_ts: z.string(),
});

// — Event app rate limited
export const AppRateLimitedEventSchema = z.object({
  type: z.literal('app_rate_limited'),
  team_id: z.string(),
  api_app_id: z.string(),
  minute_rate_limited: z.number(),
});

// — Full event callback
export const EventCallbackSchema = SlackBaseSchema.extend({
  type: z.literal('event_callback'),
  event: z.union([
    MessageEventSchema,
    AppMentionEventSchema,
    MemberJoinedChannelEventSchema,
    TeamJoinEventSchema,
  ]),
});

// — Final union of all payload types
export const SlackEventsBodySchema = z.union([
  SlackBaseSchema.extend({
    type: z.literal('url_verification'),
    challenge: z.string(),
  }),
  AppRateLimitedEventSchema,
  EventCallbackSchema,
]);

export type SlackEventsBody = z.infer<typeof SlackEventsBodySchema>;

export type TeamJoinEvent = z.infer<typeof TeamJoinEventSchema>;
export type MessageEvent = z.infer<typeof MessageEventSchema>;
export type AppMentionEvent = z.infer<typeof AppMentionEventSchema>;
export type MemberJoinedChannelEvent = z.infer<typeof MemberJoinedChannelEventSchema>;
export type AppRateLimitedEvent = z.infer<typeof AppRateLimitedEventSchema>;
export type EventCallback = z.infer<typeof EventCallbackSchema>;
