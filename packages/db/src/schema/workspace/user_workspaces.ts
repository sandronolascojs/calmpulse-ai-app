import { UserRole } from '@calmpulse-app/types';
import { relations } from 'drizzle-orm';
import { index, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from '../user/users';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaces } from './workspaces';

const userRolesEnum = pgEnum('user_roles', [UserRole.OWNER, UserRole.USER]);

export const userWorkspaces = pgTable(
  'user_workspaces',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.workspaceId),
    role: userRolesEnum('role').notNull().default(UserRole.USER),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('user_workspaces_user_id_idx').on(table.userId),
    index('user_workspaces_workspace_id_idx').on(table.workspaceId),
  ],
);

export const userWorkspaceRelations = relations(userWorkspaces, ({ one }) => ({
  user: one(users, {
    fields: [userWorkspaces.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [userWorkspaces.workspaceId],
    references: [workspaces.workspaceId],
  }),
}));

export type InsertUserWorkspace = typeof userWorkspaces.$inferInsert;
export type SelectUserWorkspace = typeof userWorkspaces.$inferSelect;
