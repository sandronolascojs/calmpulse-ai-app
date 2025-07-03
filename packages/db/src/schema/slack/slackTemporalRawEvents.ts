import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { workspaceMembers } from "../workspace";
import { createdAtField } from "../utils/timestamp";
import { generateIdField } from "../utils/id";
import { relations } from "drizzle-orm";

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
    index('slack_event_id_idx').on(table.slackEventId),
    index('workspace_member_id_idx').on(table.workspaceMemberId),
  ]
);

export const slackTemporalRawEventsRelations = relations(slackTemporalRawEvents, ({ one }) => ({
  workspaceMember: one(workspaceMembers, {
    fields: [slackTemporalRawEvents.workspaceMemberId],
    references: [workspaceMembers.workspaceMemberId],
  }),
}));

export type InsertSlackTemporalRawEvent = typeof slackTemporalRawEvents.$inferInsert;
export type SelectSlackTemporalRawEvent = typeof slackTemporalRawEvents.$inferSelect;