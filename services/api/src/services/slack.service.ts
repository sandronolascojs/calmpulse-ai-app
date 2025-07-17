import { env } from '@/config/env.config.js';
import type { AuthenticatedUser } from '@/plugins/auth.plugin.js';
import { ConflictError } from '@/utils/errors/ConflictError.js';
import type { DB } from '@calmpulse-app/db';
import type { Logger } from '@calmpulse-app/shared';
import { generateSlug } from '@calmpulse-app/shared';
import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import crypto from 'node:crypto';
import { SlackRepository } from '../repositories/slackRepository.js';
import { SlackOauthStoreStateService } from './slackOauthStoreState.service.js';
import { SlackWebClientService } from './slackWebClient.service.js';
import { WorkspaceService } from './workspace.service.js';

export class SlackService {
  private slackRepository: SlackRepository;
  private workspaceService: WorkspaceService;
  private slackWebClientService: SlackWebClientService;
  private slackOauthStoreStateService: SlackOauthStoreStateService;

  constructor(db: DB, logger: Logger) {
    this.slackRepository = new SlackRepository(db, logger);
    this.workspaceService = new WorkspaceService(db, logger);
    this.slackOauthStoreStateService = new SlackOauthStoreStateService(db, logger);
    this.slackWebClientService = new SlackWebClientService();
  }

  async generateCallback(
    query: { code?: string; state?: string },
    authenticatedUser: AuthenticatedUser,
  ) {
    const redirect_uri = this.getRedirectUri();
    if (!query.code) {
      throw new ConflictError({
        message: 'invalid_code',
      });
    }
    if (!query.state) {
      throw new ConflictError({
        message: 'invalid_state',
      });
    }
    const oauthStoreState = await this.slackOauthStoreStateService.getByState({
      state: query.state,
    });
    if (!oauthStoreState) {
      throw new ConflictError({
        message: 'invalid_state',
      });
    }
    await this.slackOauthStoreStateService.deleteByState({
      state: query.state,
    });
    const oauthResponse = await this.slackWebClientService.oauthV2Access({
      code: query.code,
      redirectUri: redirect_uri,
    });

    if (!oauthResponse.team?.id || !oauthResponse.access_token) {
      throw new ConflictError({
        message: 'Invalid OAuth response: missing required fields',
      });
    }

    if (!oauthResponse.ok) {
      throw new ConflictError({
        message: `Slack OAuth failed: ${oauthResponse.error ?? 'unknown error'}`,
      });
    }

    let workspaceId = authenticatedUser.workspace?.workspaceId;
    const accessToken = oauthResponse.access_token;
    const refreshToken = oauthResponse.refresh_token ?? null;
    const expiresAt =
      oauthResponse.expires_in && typeof oauthResponse.expires_in === 'number'
        ? new Date(Date.now() + oauthResponse.expires_in * 1000)
        : null;

    if (!workspaceId) {
      const slackWorkspaceInfo = await this.getWorkspaceInfo(accessToken);

      const createdWorkspace = await this.workspaceService.createWorkspace({
        workspace: {
          name: slackWorkspaceInfo.name,
          slug: generateSlug(slackWorkspaceInfo.name),
          logoUrl: slackWorkspaceInfo.icon?.image_230,
          externalId: slackWorkspaceInfo.id,
          domain: slackWorkspaceInfo.domain,
          externalProviderType: WorkspaceExternalProviderType.Slack,
        },
        authenticatedUser,
      });

      workspaceId = createdWorkspace.workspaceId;
    }

    await this.slackRepository.upsertWorkspaceToken(
      workspaceId,
      accessToken,
      refreshToken,
      expiresAt,
    );
  }

  async installApp(authenticatedUser: AuthenticatedUser) {
    const redirectUri = this.getRedirectUri();
    const stateId = crypto.randomBytes(32).toString('hex');
    await this.slackOauthStoreStateService.createOauthStoreState({
      state: stateId,
      userId: authenticatedUser.user.id,
    });
    const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${encodeURIComponent(
      env.SLACK_CLIENT_ID,
    )}&scope=${encodeURIComponent(env.OAUTH_SCOPES)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(stateId)}`;
    return slackOAuthUrl;
  }

  async getWorkspaceInfo(accessToken: string) {
    const teamInfo = await this.slackWebClientService.getTeamInfo(accessToken);
    if (!teamInfo.ok || !teamInfo.team?.name || !teamInfo.team.id) {
      throw new ConflictError({
        message: 'Failed to fetch workspace info from Slack',
      });
    }
    return {
      id: teamInfo.team.id,
      name: teamInfo.team.name,
      domain: teamInfo.team.domain,
      emailDomain: teamInfo.team.email_domain,
      icon: teamInfo.team.icon,
    };
  }

  private getRedirectUri(): string {
    if (env.APP_ENV === 'development') {
      return `${env.NGROK_SLACK_ENDPOINT}/slack/oauth/callback`;
    }

    return `${env.API_BASE_URL}/slack/oauth/callback`;
  }
}
