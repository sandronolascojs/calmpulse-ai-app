import { relations } from 'drizzle-orm';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id.js';
import { createdAtField, updatedAtField } from '../utils/timestamp.js';
import { userWorkspaces } from '../workspace/index.js';
import { accounts } from './accounts.js';
import { sessions } from './sessions.js';
import { verifications } from './verifications.js';

export const users = pgTable('users', {
  id: generateIdField({ name: 'id' }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});

export const userRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  verifications: many(verifications),
  userWorkspaces: one(userWorkspaces, {
    fields: [users.id],
    references: [userWorkspaces.userId],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
