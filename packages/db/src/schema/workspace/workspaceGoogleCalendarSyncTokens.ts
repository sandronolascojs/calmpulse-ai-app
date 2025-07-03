import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceMembers } from './workspaceMembers';

export const workspaceGoogleCalendarSyncTokens = pgTable(
  'workspace_google_calendar_sync_tokens',
  {
    workspaceGoogleCalendarSyncTokenId: generateIdField({
      name: 'workspace_google_calendar_sync_token_id',
    }),
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    syncToken: text('sync_token').notNull(),
    lastSyncedAt: timestamp('last_synced_at').notNull(),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('workspace_google_calendar_sync_token_workspace_member_id_idx').on(
      table.workspaceMemberId,
    ),
  ],
);

export const workspaceGoogleCalendarSyncTokensRelations = relations(
  workspaceGoogleCalendarSyncTokens,
  ({ one }) => ({
    workspaceMember: one(workspaceMembers, {
      fields: [workspaceGoogleCalendarSyncTokens.workspaceMemberId],
      references: [workspaceMembers.workspaceMemberId],
    }),
  }),
);

export type InsertWorkspaceGoogleCalendarSyncTokens =
  typeof workspaceGoogleCalendarSyncTokens.$inferInsert;
export type SelectWorkspaceGoogleCalendarSyncTokens =
  typeof workspaceGoogleCalendarSyncTokens.$inferSelect;
