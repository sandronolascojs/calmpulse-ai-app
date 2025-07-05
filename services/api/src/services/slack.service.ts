import { SlackWebClientService } from "./slackWebClient.service";
import { db } from "@calmpulse-app/db";
import { logger } from "@/utils/logger.instance";
import { SlackRepository } from "../repositories/slackRepository";
import { ConflictError } from "@/utils/errors/ConflictError";
import { contract } from "@calmpulse-app/ts-rest";
import { env } from "@/config/env.config";
import type { WorkspaceUser } from "@/plugins/auth.plugin";

export class SlackService {
  private slackWebClientService: SlackWebClientService;
  private slackRepository: SlackRepository;

  constructor(accessToken: string | undefined) {
    this.slackWebClientService = new SlackWebClientService(accessToken);
    this.slackRepository = new SlackRepository(db, logger);
  }

  async generateCallback(
    query: { code?: string },
    authenticatedUser: WorkspaceUser
  ) {
    const API_BASE_URL = env.API_BASE_URL;
    const redirect_uri = `${API_BASE_URL}/api/slack/oauth/callback`;
    if (!query.code) {
      throw new ConflictError({
        message: "invalid_code",
        path: contract.slackContract.oauthCallback.path,
        userId: authenticatedUser.id,
      });
    }
    const oauthResponse = await this.slackWebClientService.oauthV2Access({
      code: query.code,
      redirectUri: redirect_uri,
    });

    if (!oauthResponse.ok) {
      throw new ConflictError({
        message: `Slack OAuth failed: ${oauthResponse.error}`,
        path: contract.slackContract.oauthCallback.path,
        userId: authenticatedUser.id,
      });
    }
    const workspaceId = oauthResponse.team?.id;
    const accessToken = oauthResponse.access_token;
    const refreshToken = oauthResponse.refresh_token || null;
    const expiresAt =
      oauthResponse.expires_in && typeof oauthResponse.expires_in === "number"
        ? new Date(Date.now() + oauthResponse.expires_in * 1000)
        : null;

    if (workspaceId && accessToken) {
      await this.slackRepository.upsertWorkspaceToken(
        workspaceId,
        accessToken,
        refreshToken,
        expiresAt
      );
    }

    return {
      access_token: accessToken,
      token_type: oauthResponse.token_type,
      scope: oauthResponse.scope,
      bot_user_id: oauthResponse.bot_user_id,
      app_id: oauthResponse.app_id,
      authed_user: {
        id: oauthResponse.authed_user?.id,
      },
    };
  }

  async installApp() {
    const API_BASE_URL = env.API_BASE_URL;
    const redirectUri = `${API_BASE_URL}/api/slack/oauth/callback`;
    const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${encodeURIComponent(
      env.SLACK_CLIENT_ID
    )}&scope=${encodeURIComponent(env.OAUTH_SCOPES)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return slackOAuthUrl;
  } 
}
