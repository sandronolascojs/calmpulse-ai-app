import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../user/index';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceExternalProviderType } from './workspaceExternalProviderEnum';
import { workspaces } from './workspaces';

export const workspaceTokens = pgTable(
  'workspace_tokens',
  {
    tokenId: generateIdField({ name: 'token_id' }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.workspaceId)
      .unique(),
    provider: workspaceExternalProviderType('provider')
      .notNull()
      .default(WorkspaceExternalProviderType.Slack),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),
    installerUserId: text('installer_user_id').references(() => users.id),
    installedAt: timestamp('installed_at').defaultNow().notNull(),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [index('workspace_tokens_workspace_id_idx').on(table.workspaceId)],
);

export const workspaceTokenRelations = relations(workspaceTokens, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceTokens.workspaceId],
    references: [workspaces.workspaceId],
  }),
  installerUser: one(users, {
    fields: [workspaceTokens.installerUserId],
    references: [users.id],
  }),
}));

export type InsertWorkspaceToken = typeof workspaceTokens.$inferInsert;
export type SelectWorkspaceToken = typeof workspaceTokens.$inferSelect;
