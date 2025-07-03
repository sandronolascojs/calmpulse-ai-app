import { WorkspaceExternalProviderType } from "@calmpulse-app/types";
import { pgEnum } from "drizzle-orm/pg-core";

export const workspaceExternalProviderType = pgEnum('workspace_external_provider_type', [
  WorkspaceExternalProviderType.Slack,
  WorkspaceExternalProviderType.MicrosoftTeams,
]);
