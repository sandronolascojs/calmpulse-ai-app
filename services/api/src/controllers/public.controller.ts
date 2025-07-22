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
  TeamDomainChangeEventSchema,
  TeamJoinEventSchema,
  TeamRenameEventSchema,
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

      // Prevent replay attacks: reject requests older than 5 minutes
      const requestTimestamp = Number(timestamp);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (Math.abs(currentTimestamp - requestTimestamp) > 300) {
        return {
          status: 400,
          body: {
            message: 'Request timestamp expired',
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
          const eventType = event.event.type.toLowerCase();

          switch (eventType) {
            case SlackEventTypes.MESSAGE.toLowerCase(): {
              const parsedEvent = MessageEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.MESSAGE,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.MEMBER_JOINED_CHANNEL.toLowerCase(): {
              const parsedEvent = MemberJoinedChannelEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.MEMBER_JOINED_CHANNEL,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.APP_MENTION.toLowerCase(): {
              const parsedEvent = AppMentionEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.APP_MENTION,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.TEAM_JOIN.toLowerCase(): {
              const parsedEvent = TeamJoinEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.TEAM_JOIN,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.USER_CHANGE.toLowerCase(): {
              const parsedEvent = UserChangeEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.USER_CHANGE,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.DND_UPDATED_USER.toLowerCase(): {
              const parsedEvent = DndUpdatedUserEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.DND_UPDATED_USER,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.TEAM_RENAME.toLowerCase(): {
              const parsedEvent = TeamRenameEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.TEAM_RENAME,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.TEAM_DOMAIN_CHANGE.toLowerCase(): {
              const parsedEvent = TeamDomainChangeEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.TEAM_DOMAIN_CHANGE,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.APP_UNINSTALLED.toLowerCase(): {
              const parsedEvent = AppUninstalledEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.APP_UNINSTALLED,
                eventPayload: parsedEvent,
              });
              break;
            }
            case SlackEventTypes.TOKENS_REVOKED.toLowerCase(): {
              const parsedEvent = TokensRevokedEventSchema.parse(event.event);
              await slackService.handleEvent({
                externalWorkspaceId: bodyParsed.team_id,
                eventId: event.event_id,
                eventType: SlackEventTypes.TOKENS_REVOKED,
                eventPayload: parsedEvent,
              });
              break;
            }
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
