import { env } from '@/config/env.config';
import { SlackService } from '@/services/slack.service';
import { logger } from '@/utils/logger.instance';
import { db } from '@calmpulse-app/db';
import { contract } from '@calmpulse-app/ts-rest';
import { initServer } from '@ts-rest/fastify';

const server = initServer();

export const slackController = server.router(contract.slackContract, {
  install: {
    handler: async ({ request }) => {
      return await db.transaction(async (tx) => {
        const slackService = new SlackService(tx, logger);
        const slackOAuthUrl = await slackService.installApp({
          user: request.user,
          workspace: request.workspace,
        });
        return {
          status: 200,
          body: {
            ok: true,
            redirectUrl: slackOAuthUrl,
          },
        };
      });
    },
  },
  oauthCallback: {
    handler: async ({ query, request, reply }) => {
      return await db.transaction(async (tx) => {
        const slackService = new SlackService(tx, logger);
        await slackService.generateCallback(query, {
          user: request.user,
          workspace: request.workspace,
        });

        reply.status(302).header('Location', `${env.FRONTEND_URL}/onboarding?step=finish`);
        return {
          status: 302,
          body: { location: `${env.FRONTEND_URL}/onboarding?step=finish` },
        };
      });
    },
  },
});
