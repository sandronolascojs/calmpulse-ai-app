import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { users } from '../user/index.js';
import { generateIdField } from '../utils/id.js';
import { createdAtField, updatedAtField } from '../utils/timestamp.js';

export const slackOauthStoreState = pgTable('slack_oauth_store_state', {
  oauthStoreStateId: generateIdField({
    name: 'oauth_store_state_id',
  }),
  state: text('state').notNull().unique(),
  userId: text('user_id').references(() => users.id),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export const slackOauthStoreStateRelations = relations(slackOauthStoreState, ({ one }) => ({
  user: one(users, {
    fields: [slackOauthStoreState.userId],
    references: [users.id],
  }),
}));

export type SelectSlackOauthStoreState = typeof slackOauthStoreState.$inferSelect;
export type InsertSlackOauthStoreState = typeof slackOauthStoreState.$inferInsert;
