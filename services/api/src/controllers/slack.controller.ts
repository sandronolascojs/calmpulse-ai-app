import { SlackService } from '@/services/slack.service';
import { logger } from '@/utils/logger.instance';
import { db } from '@calmpulse-app/db';
import { contract } from '@calmpulse-app/ts-rest';
import { initServer } from '@ts-rest/fastify';

const server = initServer();

export const slackController = server.router(contract.slackContract, {
  install: {
    handler: async () => {
      const slackService = new SlackService(db, logger);
      const slackOAuthUrl = await slackService.installApp();
      return {
        status: 302,
        body: undefined,
        headers: {
          Location: slackOAuthUrl,
        },
      };
    },
  },
  oauthCallback: {
    handler: async ({ query, request }) => {
      return await db.transaction(async (tx) => {
        const slackService = new SlackService(tx, logger);
        await slackService.generateCallback(query, {
          user: request.user,
          workspace: request.workspace,
        });

        return {
          status: 200,
          body: undefined,
        };
      });
    },
  },
});
