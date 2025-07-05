import { env } from '@/config/env.config';
import type { AuthenticatedUser } from '@/plugins/auth.plugin';
import { ConflictError } from '@/utils/errors/ConflictError';
import type { DB } from '@calmpulse-app/db';
import { generateSlug } from '@calmpulse-app/shared';
import { WorkspaceExternalProviderType } from '@calmpulse-app/types';
import type { Logger } from '@calmpulse-app/utils';
import crypto from 'node:crypto';
import { SlackRepository } from '../repositories/slackRepository';
import { SlackWebClientService } from './slackWebClient.service';
import { WorkspaceService } from './workspace.service';

export class SlackService {
  private slackRepository: SlackRepository;
  private workspaceService: WorkspaceService;
  private slackWebClientService: SlackWebClientService;

  constructor(db: DB, logger: Logger) {
    this.slackRepository = new SlackRepository(db, logger);
    this.workspaceService = new WorkspaceService(db, logger);
    this.slackWebClientService = new SlackWebClientService();
  }

  async generateCallback(query: { code?: string }, authenticatedUser: AuthenticatedUser) {
    const redirect_uri = this.getRedirectUri();
    if (!query.code) {
      throw new ConflictError({
        message: 'invalid_code',
      });
    }
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
        message: `Slack OAuth failed: ${oauthResponse.error}`,
      });
    }

    let workspaceId = authenticatedUser.workspace?.workspaceId;
    const accessToken = oauthResponse.access_token;
    const refreshToken = oauthResponse.refresh_token || null;
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

  async installApp() {
    const redirectUri = this.getRedirectUri();
    const stateId = crypto.randomBytes(32).toString('hex');
    const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${encodeURIComponent(
      env.SLACK_CLIENT_ID,
    )}&scope=${encodeURIComponent(env.OAUTH_SCOPES)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(stateId)}`;
    return slackOAuthUrl;
  }

  async getWorkspaceInfo(accessToken: string) {
    const teamInfo = await this.slackWebClientService.getTeamInfo(accessToken);
    if (!teamInfo.ok || !teamInfo || !teamInfo.team || !teamInfo.team.name || !teamInfo.team.id) {
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
    return `${env.API_BASE_URL}/api/slack/oauth/callback`;
  }
}
