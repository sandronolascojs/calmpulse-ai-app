import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceMembers } from './workspaceMembers';

/**
 * table to store the watch channels for the google calendar integration for a workspace member
 */
export const workspaceGoogleCalendarWatchChannels = pgTable(
  'workspace_google_calendar_watch_channels',
  {
    watchId: generateIdField({ name: 'watch_id' }),
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    channelId: text('channel_id').notNull(),
    resourceId: text('resource_id').notNull(),
    expiration: timestamp('expiration').notNull(),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('workspace_google_calendar_watch_channels_workspace_member_id_idx').on(
      table.workspaceMemberId,
    ),
  ],
);

export const workspaceGoogleCalendarWatchChannelsRelations = relations(
  workspaceGoogleCalendarWatchChannels,
  ({ one }) => ({
    workspaceMember: one(workspaceMembers, {
      fields: [workspaceGoogleCalendarWatchChannels.workspaceMemberId],
      references: [workspaceMembers.workspaceMemberId],
    }),
  }),
);

export type InsertWorkspaceGoogleCalendarWatchChannels =
  typeof workspaceGoogleCalendarWatchChannels.$inferInsert;
export type SelectWorkspaceGoogleCalendarWatchChannels =
  typeof workspaceGoogleCalendarWatchChannels.$inferSelect;
