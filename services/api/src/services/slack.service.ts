import { env } from '@/config/env.config';
import type { AuthenticatedUser } from '@/plugins/auth.plugin';
import { SlackTemporalRawEventsRepository } from '@/repositories/slackTemporalRawEventsRepository';
import { ConflictError } from '@/utils/errors/ConflictError';
import type { DB } from '@calmpulse-app/db';
import type { InsertWorkspaceMember } from '@calmpulse-app/db/schema';
import type { Logger } from '@calmpulse-app/shared';
import { generateSlug } from '@calmpulse-app/shared';
import {
  SlackEventTypes,
  WorkspaceDisableReason,
  WorkspaceExternalProviderType,
  type AppMentionEvent,
  type AppUninstalledEvent,
  type MemberJoinedChannelEvent,
  type MessageEvent,
  type TeamJoinEvent,
  type UserChangeEvent,
} from '@calmpulse-app/types';
import crypto from 'node:crypto';
import { SlackRepository } from '../repositories/slackRepository';
import { SlackOauthStoreStateService } from './slackOauthStoreState.service';
import { SlackWebClientService } from './slackWebClient.service';
import { WorkspaceService } from './workspace.service';
import { WorkspaceMemberService } from './workspaceMember.service';

const BOT_NAMES = ['slackbot', 'slack-actions-bot', 'slack-actions-bot-dev'];

export class SlackService {
  private slackRepository: SlackRepository;
  private workspaceService: WorkspaceService;
  private slackWebClientService: SlackWebClientService;
  private slackOauthStoreStateService: SlackOauthStoreStateService;
  private slackTemporalRawEventsRepository: SlackTemporalRawEventsRepository;
  private workspaceMemberService: WorkspaceMemberService;
  private logger: Logger;

  constructor(db: DB, logger: Logger) {
    this.slackRepository = new SlackRepository(db, logger);
    this.workspaceService = new WorkspaceService(db, logger);
    this.slackOauthStoreStateService = new SlackOauthStoreStateService(db, logger);
    this.workspaceMemberService = new WorkspaceMemberService(db, logger);
    this.slackWebClientService = new SlackWebClientService();
    this.slackTemporalRawEventsRepository = new SlackTemporalRawEventsRepository(db, logger);
    this.logger = logger;
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

    await this.slackRepository.upsertWorkspaceToken({
      workspaceId,
      accessToken,
      refreshToken,
      expiresAt,
    });

    const slackUsers = await this.slackWebClientService.getUsers(accessToken);

    const sanitizedWorkspaceMembers: InsertWorkspaceMember[] =
      slackUsers.members
        ?.map((member) => {
          if (member.is_bot || BOT_NAMES.includes(member.name ?? '')) {
            return null;
          }

          if (!member.id) {
            return null;
          }

          return {
            workspaceId,
            name: member.real_name ?? 'N/A',
            title: member.profile?.title ?? null,
            email: member.profile?.email ?? 'N/A',
            avatarUrl: member.profile?.image_192 ?? null,
            externalId: member.id,
          };
        })
        .filter((member) => member !== null) ?? [];

    this.logger.info('Syncing workspace members', {
      workspaceId,
      memberCount: sanitizedWorkspaceMembers.length,
    });
    await this.workspaceMemberService.createWorkspaceMembers(sanitizedWorkspaceMembers);
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

  async handleEvent({
    externalWorkspaceId,
    eventId,
    eventPayload,
    eventType,
  }:
    | {
        externalWorkspaceId: string;
        eventId: string;
        eventType: SlackEventTypes.MESSAGE;
        eventPayload: MessageEvent;
      }
    | {
        externalWorkspaceId: string;
        eventId: string;
        eventType: SlackEventTypes.MEMBER_JOINED_CHANNEL;
        eventPayload: MemberJoinedChannelEvent;
      }
    | {
        externalWorkspaceId: string;
        eventId: string;
        eventType: SlackEventTypes.APP_MENTION;
        eventPayload: AppMentionEvent;
      }
    | {
        externalWorkspaceId: string;
        eventId: string;
        eventType: SlackEventTypes.TEAM_JOIN;
        eventPayload: TeamJoinEvent;
      }
    | {
        externalWorkspaceId: string;
        eventId: string;
        eventType: SlackEventTypes.USER_CHANGE;
        eventPayload: UserChangeEvent;
      }
    | {
        externalWorkspaceId: string;
        eventId: string;
        eventType: SlackEventTypes.APP_UNINSTALLED;
        eventPayload: AppUninstalledEvent;
      }) {
    if (eventType === SlackEventTypes.MESSAGE) {
      const workspace = await this.workspaceService.getWorkspaceByExternalId({
        externalId: externalWorkspaceId,
      });
      if (!workspace) {
        throw new ConflictError({
          message: 'Workspace not found. Workspace not installed.',
        });
      }

      if (!eventPayload.user) {
        throw new ConflictError({
          message: 'User id not found in message event',
        });
      }

      const workspaceMember = await this.workspaceMemberService.getWorkspaceMemberByExternalUserId({
        externalUserId: eventPayload.user,
        workspaceId: workspace.workspaceId,
      });

      if (!workspaceMember) {
        throw new ConflictError({
          message: 'Workspace member not found',
        });
      }

      await this.slackTemporalRawEventsRepository.saveSlackTemporalRawEvent({
        eventId,
        eventPayload,
        eventType,
        workspaceMemberId: workspaceMember.workspaceMemberId,
      });
    }

    if (eventType === SlackEventTypes.MEMBER_JOINED_CHANNEL) {
      const workspace = await this.workspaceService.getWorkspaceByExternalId({
        externalId: externalWorkspaceId,
      });
      if (!workspace) {
        throw new ConflictError({
          message: 'Workspace not found. Workspace not installed.',
        });
      }

      if (!eventPayload.user) {
        throw new ConflictError({
          message: 'User id not found in member joined channel event',
        });
      }

      if (!eventPayload.team) {
        throw new ConflictError({
          message: 'Team id not found in member joined channel event',
        });
      }

      const workspaceMember = await this.workspaceMemberService.getWorkspaceMemberByExternalUserId({
        externalUserId: eventPayload.user,
        workspaceId: workspace.workspaceId,
      });

      if (!workspaceMember) {
        throw new ConflictError({
          message: 'Workspace member not found.',
        });
      }

      await this.slackTemporalRawEventsRepository.saveSlackTemporalRawEvent({
        eventId,
        eventPayload,
        eventType,
        workspaceMemberId: workspaceMember.workspaceMemberId,
      });
    }

    if (eventType === SlackEventTypes.APP_MENTION) {
      const workspace = await this.workspaceService.getWorkspaceByExternalId({
        externalId: externalWorkspaceId,
      });
      if (!workspace) {
        throw new ConflictError({
          message: 'Workspace not found. Workspace not installed.',
        });
      }

      if (!eventPayload.user) {
        throw new ConflictError({
          message: 'User id not found in app mention event',
        });
      }

      const workspaceMember = await this.workspaceMemberService.getWorkspaceMemberByExternalUserId({
        externalUserId: eventPayload.user,
        workspaceId: workspace.workspaceId,
      });

      if (!workspaceMember) {
        throw new ConflictError({
          message: 'Workspace member not found',
        });
      }

      await this.slackTemporalRawEventsRepository.saveSlackTemporalRawEvent({
        eventId,
        eventPayload,
        eventType,
        workspaceMemberId: workspaceMember.workspaceMemberId,
      });
    }

    if (eventType === SlackEventTypes.TEAM_JOIN) {
      const workspace = await this.workspaceService.getWorkspaceByExternalId({
        externalId: externalWorkspaceId,
      });
      if (!workspace) {
        throw new ConflictError({
          message: 'Workspace not found. Workspace not installed.',
        });
      }

      const workspaceToken = await this.slackRepository.getWorkspaceTokenByWorkspaceId({
        workspaceId: workspace.workspaceId,
      });
      if (!workspaceToken) {
        throw new ConflictError({
          message: 'Workspace token not found. Workspace not installed.',
        });
      }

      const userFromSlack = await this.slackWebClientService.getUser(
        workspaceToken.accessToken,
        eventPayload.user.id,
      );

      if (!userFromSlack.ok) {
        throw new ConflictError({
          message: 'Failed to fetch user from Slack',
        });
      }

      await this.workspaceMemberService.createWorkspaceMembers([
        {
          email: userFromSlack.user?.profile?.email ?? 'N/A',
          name: userFromSlack.user?.real_name ?? 'N/A',
          workspaceId: workspace.workspaceId,
          externalId: eventPayload.user.id,
          avatarUrl: userFromSlack.user?.profile?.image_192 ?? null,
          title: userFromSlack.user?.profile?.title ?? null,
        },
      ]);
    }

    if (eventType === SlackEventTypes.USER_CHANGE) {
      const workspace = await this.workspaceService.getWorkspaceByExternalId({
        externalId: externalWorkspaceId,
      });
      if (!workspace) {
        throw new ConflictError({
          message: 'Workspace not found. Workspace not installed.',
        });
      }

      const workspaceMember = await this.workspaceMemberService.getWorkspaceMemberByExternalUserId({
        externalUserId: eventPayload.user.id,
        workspaceId: workspace.workspaceId,
      });

      if (!workspaceMember) {
        throw new ConflictError({
          message: 'Workspace member not found',
        });
      }

      const workspaceToken = await this.slackRepository.getWorkspaceTokenByWorkspaceId({
        workspaceId: workspace.workspaceId,
      });
      if (!workspaceToken) {
        throw new ConflictError({
          message: 'Workspace token not found. Workspace not installed.',
        });
      }

      const userFromSlack = await this.slackWebClientService.getUser(
        workspaceToken.accessToken,
        eventPayload.user.id,
      );

      await this.workspaceMemberService.updateWorkspaceMember({
        workspaceMemberId: workspaceMember.workspaceMemberId,
        name: userFromSlack.user?.real_name ?? 'N/A',
        email: userFromSlack.user?.profile?.email ?? 'N/A',
        avatarUrl: userFromSlack.user?.profile?.image_192 ?? null,
        title: userFromSlack.user?.profile?.title ?? null,
      });
    }

    if (eventType === SlackEventTypes.APP_UNINSTALLED) {
      const workspace = await this.workspaceService.getWorkspaceByExternalId({
        externalId: externalWorkspaceId,
      });

      if (!workspace) {
        throw new ConflictError({
          message: 'Workspace not found. Workspace not installed.',
        });
      }

      await this.slackRepository.deleteWorkspaceTokenByWorkspaceId({
        workspaceId: workspace.workspaceId,
      });

      await this.workspaceService.updateWorkspace({
        workspaceId: workspace.workspaceId,
        workspace: {
          isDisabled: true,
          deactivationReason: WorkspaceDisableReason.APP_UNINSTALLED,
          deactivatedAt: new Date(),
        },
      });
    }
  }

  private getRedirectUri(): string {
    if (env.APP_ENV === 'development') {
      return `${env.NGROK_SLACK_ENDPOINT}/slack/oauth/callback`;
    }

    return `${env.API_BASE_URL}/slack/oauth/callback`;
  }
}
