import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id.js';
import { createdAtField } from '../utils/timestamp.js';
import { workspaceMembers } from '../workspace/index.js';

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
    text: text('text').notNull(),
    timestamp: timestamp('timestamp').notNull(),
    createdAt: createdAtField,
  },
  (table) => [
    index('slack_temporal_raw_events_slack_event_id_idx').on(table.slackEventId),
    index('slack_temporal_raw_events_workspace_member_id_idx').on(table.workspaceMemberId),
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
