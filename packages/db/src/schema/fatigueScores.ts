import { relations } from 'drizzle-orm';
import { date, index, pgTable, real, text } from 'drizzle-orm/pg-core';
import { generateIdField } from './utils/id.js';
import { createdAtField, updatedAtField } from './utils/timestamp.js';
import { workspaceMembers } from './workspace/workspaceMembers.js';

export const fatigueScores = pgTable(
  'fatigue_scores',
  {
    fatigueScoreId: generateIdField({ name: 'fatigue_score_id' }),
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    day: date('day').notNull(),
    fatigueIndex: real('fatigue_index').notNull(),
    label: text('label').notNull(),
    advice: text('advice').notNull(),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('workspace_member_id_fatigue_score_id_idx').on(
      table.workspaceMemberId,
      table.fatigueScoreId,
    ),
  ],
);

export const fatigueScoresRelations = relations(fatigueScores, ({ one }) => ({
  workspaceMember: one(workspaceMembers, {
    fields: [fatigueScores.workspaceMemberId],
    references: [workspaceMembers.workspaceMemberId],
  }),
}));
