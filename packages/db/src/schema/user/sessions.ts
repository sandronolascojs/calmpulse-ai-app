import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id.js';
import { createdAtField, updatedAtField } from '../utils/timestamp.js';
import { users } from './users.js';

export const sessions = pgTable('sessions', {
  id: generateIdField({ name: 'id' }),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: createdAtField,
  updatedAt: updatedAtField,
});
