import { contract } from '@calmpulse-app/ts-rest';
import { initServer } from '@ts-rest/fastify';
import { SlackService } from '@/services/slack.service';

const server = initServer();

export const slackController = server.router(contract.slackContract, {
  install: {
    handler: async () => {
      const slackService = new SlackService(undefined);
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
      const slackService = new SlackService(undefined);
      await slackService.generateCallback(query, request.user);

      return {
        status: 200,
        body: undefined,
      }
    },
  },
});
