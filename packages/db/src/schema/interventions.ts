import { relations } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from './utils/id';
import { createdAtField, updatedAtField } from './utils/timestamp';
import { workspaceMembers } from './workspace/workspaceMembers';

export const interventions = pgTable(
  'interventions',
  {
    interventionId: generateIdField({ name: 'intervention_id' }),
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    date: timestamp('date').notNull(),
    type: text('type').notNull(),
    details: text('details'),
    acknowledged: boolean('acknowledged').notNull().default(false),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('workspace_member_id_intervention_id_idx').on(
      table.workspaceMemberId,
      table.interventionId,
    ),
  ],
);

export const interventionsRelations = relations(interventions, ({ one }) => ({
  workspaceMember: one(workspaceMembers, {
    fields: [interventions.workspaceMemberId],
    references: [workspaceMembers.workspaceMemberId],
  }),
}));
