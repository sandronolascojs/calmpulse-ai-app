import { relations } from 'drizzle-orm';
import { date, index, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { createdAtField, updatedAtField } from './utils/timestamp.js';
import { workspaceMembers } from './workspace/workspaceMembers.js';

export const dailyFeatures = pgTable(
  'daily_features',
  {
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    day: date('day').notNull(),
    afterHoursMessages: integer('after_hours_messages').notNull().default(0),
    negativeMessages: integer('negative_messages').notNull().default(0),
    meetingMinutes: integer('meeting_minutes').notNull().default(0),
    longBreaks: integer('long_breaks').notNull().default(0),
    positiveMessages: integer('positive_messages').notNull().default(0),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    primaryKey({ columns: [table.workspaceMemberId, table.day] }),
    index('workspace_member_id_idx').on(table.workspaceMemberId),
  ],
);

export const dailyFeaturesRelations = relations(dailyFeatures, ({ one }) => ({
  workspaceMember: one(workspaceMembers, {
    fields: [dailyFeatures.workspaceMemberId],
    references: [workspaceMembers.workspaceMemberId],
  }),
}));

export type InsertDailyFeature = typeof dailyFeatures.$inferInsert;
export type SelectDailyFeature = typeof dailyFeatures.$inferSelect;
