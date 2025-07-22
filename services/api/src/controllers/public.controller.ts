import { env } from '@/config/env.config';
import { SlackService } from '@/services/slack.service';
import { ConflictError } from '@/utils/errors/ConflictError';
import { logger } from '@/utils/logger.instance';
import { db } from '@calmpulse-app/db';
import { contract } from '@calmpulse-app/ts-rest';
import {
  AppMentionEventSchema,
  AppUninstalledEventSchema,
  DndUpdatedUserEventSchema,
  EventCallbackSchema,
  MemberJoinedChannelEventSchema,
  MessageEventSchema,
  SlackEventTypes,
  SlackEventsBodySchema,
  TeamJoinEventSchema,
  TokensRevokedEventSchema,
  UserChangeEventSchema,
} from '@calmpulse-app/types';
import { initServer } from '@ts-rest/fastify';
import crypto from 'node:crypto';

const server = initServer();

export const publicController = server.router(contract.publicContract, {
  health: {
    handler: async () => {
      return {
        status: 200,
        body: {
          message: 'API Service is running',
        },
      };
    },
  },
  slackEvents: {
    handler: async ({ request }) => {
      const timestamp = request.headers['x-slack-request-timestamp'];
      const signature = request.headers['x-slack-signature'];

      if (!timestamp || !signature) {
        return {
          status: 400,
          body: {
            message: 'Missing headers',
          },
        };
      }

      const bodyRaw = JSON.stringify(request.body);

      if (!bodyRaw) {
        return {
          status: 400,
          body: {
            message: 'Missing body',
          },
        };
      }

      const secret = env.SLACK_SIGNING_SECRET;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`v0:${timestamp}:${bodyRaw}`);
      if (
        !crypto.timingSafeEqual(
          Buffer.from(`v0=${hmac.digest('hex')}`),
          Buffer.from(signature.toString()),
        )
      ) {
        return {
          status: 400,
          body: {
            message: 'Invalid signature',
          },
        };
      }

      const bodyParsed = SlackEventsBodySchema.parse(request.body);

      if (bodyParsed.type === 'url_verification') {
        return {
          status: 200,
          body: { challenge: bodyParsed.challenge },
        };
      }

      if (bodyParsed.type === 'event_callback') {
        const event = EventCallbackSchema.parse(bodyParsed.event);

        await db.transaction(async (trx) => {
          if (!event.event_id) {
            throw new ConflictError({
              message: 'Event id is required. Event not saved.',
            });
          }

          const slackService = new SlackService(trx, logger);

          if (event.event.type === SlackEventTypes.MESSAGE.toLowerCase()) {
            const messageEvent = MessageEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.MESSAGE,
              eventPayload: messageEvent,
            });
          }

          if (event.event.type === SlackEventTypes.MEMBER_JOINED_CHANNEL.toLowerCase()) {
            const memberJoinedChannelEvent = MemberJoinedChannelEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.MEMBER_JOINED_CHANNEL,
              eventPayload: memberJoinedChannelEvent,
            });
          }

          if (event.event.type === SlackEventTypes.APP_MENTION.toLowerCase()) {
            const appMentionEvent = AppMentionEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.APP_MENTION,
              eventPayload: appMentionEvent,
            });
          }

          if (event.event.type === SlackEventTypes.TEAM_JOIN.toLowerCase()) {
            const teamJoinEvent = TeamJoinEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.TEAM_JOIN,
              eventPayload: teamJoinEvent,
            });
          }

          if (event.event.type === SlackEventTypes.USER_CHANGE.toLowerCase()) {
            const userChangeEvent = UserChangeEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.USER_CHANGE,
              eventPayload: userChangeEvent,
            });
          }

          if (event.event.type === SlackEventTypes.APP_UNINSTALLED.toLowerCase()) {
            const appUninstalledEvent = AppUninstalledEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.APP_UNINSTALLED,
              eventPayload: appUninstalledEvent,
            });
          }

          if (event.event.type === SlackEventTypes.TOKENS_REVOKED.toLowerCase()) {
            const tokensRevokedEvent = TokensRevokedEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.TOKENS_REVOKED,
              eventPayload: tokensRevokedEvent,
            });
          }

          if (event.event.type === SlackEventTypes.DND_UPDATED_USER.toLowerCase()) {
            const dndUpdatedUserEvent = DndUpdatedUserEventSchema.parse(event.event);
            await slackService.handleEvent({
              externalWorkspaceId: bodyParsed.team_id,
              eventId: event.event_id,
              eventType: SlackEventTypes.DND_UPDATED_USER,
              eventPayload: dndUpdatedUserEvent,
            });
          }
        });

        return {
          status: 200,
          body: undefined,
        };
      }

      return {
        status: 200,
        body: undefined,
      };
    },
  },
});
