import { Locale } from '@calmpulse-app/types';
import { relations } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaceMembers } from './workspaceMembers';

export const localeEnum = pgEnum('locale', [
  Locale.EN_US,
  Locale.ES_ES,
  Locale.FR_FR,
  Locale.DE_DE,
  Locale.IT_IT,
  Locale.PT_PT,
  Locale.RU_RU,
  Locale.ZH_CN,
  Locale.JA_JP,
  Locale.KO_KR,
  Locale.PT_BR,
  Locale.AR_SA,
  Locale.ZH_TW,
  Locale.NL_NL,
  Locale.PL_PL,
  Locale.SV_SE,
  Locale.TR_TR,
  Locale.UK_UA,
  Locale.VI_VN,
  Locale.ID_ID,
  Locale.MS_MY,
  Locale.TH_TH,
  Locale.MS_SG,
]);

export const workspaceMemberPreferences = pgTable(
  'workspace_member_preferences',
  {
    workspaceMemberPreferencesId: generateIdField({ name: 'workspace_member_preferences_id' }),
    workspaceMemberId: text('workspace_member_id')
      .notNull()
      .references(() => workspaceMembers.workspaceMemberId),
    timezone: text('timezone').notNull(),
    locale: localeEnum('locale').notNull().default(Locale.EN_US),
    isDndEnabled: boolean('is_dnd_enabled').notNull().default(false),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    uniqueIndex('workspace_member_preferences_workspace_member_id_unique_idx').on(
      table.workspaceMemberId,
    ),
  ],
);

export const workspaceMemberPreferencesRelations = relations(
  workspaceMemberPreferences,
  ({ one }) => ({
    workspaceMember: one(workspaceMembers, {
      fields: [workspaceMemberPreferences.workspaceMemberId],
      references: [workspaceMembers.workspaceMemberId],
    }),
  }),
);

export type InsertWorkspaceMemberPreferences = typeof workspaceMemberPreferences.$inferInsert;
export type SelectWorkspaceMemberPreferences = typeof workspaceMemberPreferences.$inferSelect;
export type UpdateWorkspaceMemberPreferences = Partial<SelectWorkspaceMemberPreferences>;
