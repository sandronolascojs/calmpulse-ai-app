import { relations } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { generateIdField } from '../utils/id';
import { createdAtField, updatedAtField } from '../utils/timestamp';
import { workspaces } from './workspaces';

export const workspaceGoogleCalendarIntegrations = pgTable(
  'workspace_google_calendar_integrations',
  {
    workspaceGoogleCalendarIntegrationId: generateIdField({
      name: 'workspace_google_calendar_integration_id',
    }),
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspaces.workspaceId),
    googleCustomerId: text('google_customer_id'),
    calendarInstalled: boolean('calendar_installed').notNull().default(false),
    calendarInstallationDate: timestamp('calendar_installation_date'),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index('workspace_google_calendar_integration_workspace_id_idx').on(table.workspaceId),
  ],
);

export const workspaceGoogleCalendarIntegrationRelations = relations(
  workspaceGoogleCalendarIntegrations,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceGoogleCalendarIntegrations.workspaceId],
      references: [workspaces.workspaceId],
    }),
  }),
);

export type InsertWorkspaceGoogleCalendarIntegration =
  typeof workspaceGoogleCalendarIntegrations.$inferInsert;
export type SelectWorkspaceGoogleCalendarIntegration =
  typeof workspaceGoogleCalendarIntegrations.$inferSelect;
