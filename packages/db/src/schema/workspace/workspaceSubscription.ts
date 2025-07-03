import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { createdAtField, updatedAtField } from "../utils/timestamp";
import { generateIdField } from "../utils/id";
import {
  WorkspaceSubscriptionStatus,
  WorkspaceSubscriptionTier,
} from "@calmpulse-app/types";
import { relations } from "drizzle-orm";

const workspaceSubscriptionTier = pgEnum("workspace_subscription_tier", [
  WorkspaceSubscriptionTier.FREE,
  WorkspaceSubscriptionTier.TEAM,
  WorkspaceSubscriptionTier.ENTERPRISE,
]);

const workspaceSubscriptionStatus = pgEnum("workspace_subscription_status", [
  WorkspaceSubscriptionStatus.ACTIVE,
  WorkspaceSubscriptionStatus.PAST_DUE,
  WorkspaceSubscriptionStatus.PENDING_CANCEL,
  WorkspaceSubscriptionStatus.CANCELLED,
  WorkspaceSubscriptionStatus.PENDING_PAYMENT,
]);

export const workspaceSubscription = pgTable(
  "workspace_subscription",
  {
    workspaceSubscriptionId: generateIdField({ name: "subscription_id" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.workspaceId),
    tier: workspaceSubscriptionTier("tier")
      .notNull()
      .default(WorkspaceSubscriptionTier.FREE),
    usedSeats: integer("used_seats").notNull().default(0),
    subscriptionStatus: workspaceSubscriptionStatus("subscription_status")
      .notNull()
      .default(WorkspaceSubscriptionStatus.PENDING_PAYMENT),
    nextBillingDate: timestamp("next_billing_date"),
    externalSubscriptionId: text("external_subscription_id"),
    createdAt: createdAtField,
    updatedAt: updatedAtField,
  },
  (table) => [
    index("workspace_subscription_workspace_id_idx").on(table.workspaceId),
  ]
);

export const workspaceSubscriptionRelations = relations(workspaceSubscription, ({ many }) => ({
  workspace: many(workspaces),
}));
