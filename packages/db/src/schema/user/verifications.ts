import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id.js';
import { createdAtField, updatedAtField } from '../utils/timestamp.js';

export const verifications = pgTable('verifications', {
  id: generateIdField({ name: 'id' }),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});
