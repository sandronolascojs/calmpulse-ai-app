import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceExternalProviderType } from './workspaceExternalProviderEnum';
import { workspaceMembers } from './workspaceMembers';
import { workspaceTokens } from './workspaceTokens';

export const workspaces = pgTable('workspaces', {
  workspaceId: generateIdField({ name: 'workspace_id' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  logoUrl: text('logo_url'),
  externalId: text('external_id').notNull(),
  domain: text('domain'),
  externalProviderType: workspaceExternalProviderType('external_provider_type')
    .notNull()
    .default(WorkspaceExternalProviderType.Slack),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export const workspaceRelations = relations(workspaces, ({ many }) => ({
  workspaceTokens: many(workspaceTokens),
  workspaceMembers: many(workspaceMembers),
}));

export type InsertWorkspace = typeof workspaces.$inferInsert;
export type SelectWorkspace = typeof workspaces.$inferSelect;
