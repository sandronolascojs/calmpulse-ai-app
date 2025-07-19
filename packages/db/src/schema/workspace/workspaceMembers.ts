import { relations } from 'drizzle-orm';
import { index, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id.js';
import { MAX_NAME_LENGTH } from '../utils/maxLengths.js';
import { createdAtField, updatedAtField } from '../utils/timestamp.js';
import { workspaces } from './workspaces.js';

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    workspaceMemberId: generateIdField({ name: 'workspace_member_id' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.workspaceId),
    name: varchar('name', { length: MAX_NAME_LENGTH }).notNull(),
    email: text('email').notNull(),
    title: text('title'),
    avatarUrl: text('avatar_url'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [index('workspace_member_workspace_id_idx').on(table.workspaceId)],
);

export const workspaceMemberRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.workspaceId],
  }),
}));

export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type SelectWorkspaceMember = typeof workspaceMembers.$inferSelect;
