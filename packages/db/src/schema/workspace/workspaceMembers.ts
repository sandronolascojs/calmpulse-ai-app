import { relations } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { MAX_NAME_LENGTH } from '../utils/maxLengths';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaces } from './workspaces';

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
    externalId: text('external_id').notNull().unique(),
    avatarUrl: text('avatar_url'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('workspace_member_workspace_email_unique_idx').on(table.workspaceId, table.email),
    uniqueIndex('workspace_member_workspace_external_id_unique_idx').on(
      table.workspaceId,
      table.externalId,
    ),
  ],
);

export const workspaceMemberRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.workspaceId],
  }),
}));

export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type SelectWorkspaceMember = typeof workspaceMembers.$inferSelect;
export type UpdateWorkspaceMember = Partial<SelectWorkspaceMember>;
