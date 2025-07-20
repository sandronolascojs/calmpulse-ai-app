import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import { relations } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { MAX_NAME_LENGTH } from '../utils/maxLengths';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceExternalProviderType } from './workspaceExternalProviderEnum';
import { workspaceMembers } from './workspaceMembers';
import { workspaceTokens } from './workspaceTokens';

const MAX_SLUG_LENGTH = 100;
const MAX_DOMAIN_LENGTH = 255;

export const workspaces = pgTable('workspaces', {
  workspaceId: generateIdField({ name: 'workspace_id' }),
  name: varchar('name', { length: MAX_NAME_LENGTH }).notNull(),
  slug: varchar('slug', { length: MAX_SLUG_LENGTH }).notNull(),
  logoUrl: text('logo_url'),
  externalId: text('external_id').notNull(),
  domain: varchar('domain', { length: MAX_DOMAIN_LENGTH }),
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
