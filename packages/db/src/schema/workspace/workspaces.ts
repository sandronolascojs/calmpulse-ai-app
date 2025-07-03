import { pgTable, text } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceExternalProviderType } from './workspaceExternalProviderEnum';
import { relations } from 'drizzle-orm';
import { workspaceTokens } from './workspaceTokens';
import { workspaceMembers } from './workspaceMembers';

export const workspaces = pgTable('workspaces', {
  workspaceId: generateIdField({ name: 'workspace_id' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  logoUrl: text('logo_url'),
  description: text('description'),
  externalId: text('external_id'),
  externalProviderType: workspaceExternalProviderType('external_provider_type').notNull().default(WorkspaceExternalProviderType.Slack),
  createdAt: createdAtField,
  updatedAt: updatedAtField
});

export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
  workspaceTokens: one(workspaceTokens, {
    fields: [workspaces.workspaceId],
    references: [workspaceTokens.workspaceId],
  }),
  workspaceMembers: many(workspaceMembers)
}));

export type InsertWorkspace = typeof workspaces.$inferInsert;
export type SelectWorkspace = typeof workspaces.$inferSelect;
