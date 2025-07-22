import { SlackEventTypes } from '@calmpulse-app/types';
import { relations } from 'drizzle-orm';
import { index, jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField } from '../utils/timestamp';
import { workspaceMembers } from '../workspace/index';

const slackEventTypes = pgEnum('slack_event_types', [
  SlackEventTypes.TEAM_JOIN,
  SlackEventTypes.MESSAGE,
  SlackEventTypes.APP_MENTION,
  SlackEventTypes.MEMBER_JOINED_CHANNEL,
]);

/**
 * Temporary storage for raw Slack events, purged daily
 */
export const slackTemporalRawEvents = pgTable(
  'slack_temporal_raw_events',
  {
    slackTemporalRawEventId: generateIdField({ name: 'slack_temporal_raw_event_id' }),
    slackEventId: text('slack_event_id').notNull(),
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    type: slackEventTypes('type').notNull(),
    payload: jsonb('payload').notNull(),
    timestamp: timestamp('timestamp').notNull(),
    createdAt: createdAtField,
  },
  (table) => [
    index('slack_temporal_raw_events_slack_event_id_idx').on(table.slackEventId),
    index('slack_temporal_raw_events_workspace_member_id_idx').on(table.workspaceMemberId),
    index('slack_temporal_raw_events_type_idx').on(table.type),
  ],
);

export const slackTemporalRawEventsRelations = relations(slackTemporalRawEvents, ({ one }) => ({
  workspaceMember: one(workspaceMembers, {
    fields: [slackTemporalRawEvents.workspaceMemberId],
    references: [workspaceMembers.workspaceMemberId],
  }),
}));

export type InsertSlackTemporalRawEvent = typeof slackTemporalRawEvents.$inferInsert;
export type SelectSlackTemporalRawEvent = typeof slackTemporalRawEvents.$inferSelect;
