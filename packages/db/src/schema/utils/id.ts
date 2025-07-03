import { createId } from '@paralleldrive/cuid2';
import { text } from 'drizzle-orm/pg-core';

export const generateIdField = ({ name }: { name: string }) => {
  return text(name)
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull()
    .unique();
};
