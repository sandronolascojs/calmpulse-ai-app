import { timestamp } from 'drizzle-orm/pg-core';

export const createdAtField = timestamp('created_at').notNull().defaultNow();
export const updatedAtField = timestamp('updated_at')
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
