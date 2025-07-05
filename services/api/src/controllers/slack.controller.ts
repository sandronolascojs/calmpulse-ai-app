import { SlackService } from '@/services/slack.service';
import { contract } from '@calmpulse-app/ts-rest';
import { initServer } from '@ts-rest/fastify';

const server = initServer();

export const slackController = server.router(contract.slackContract, {
  install: {
    handler: async () => {
      const slackService = new SlackService();
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
      const slackService = new SlackService();
      await slackService.generateCallback(query, {
        user: request.user,
        workspace: request.workspace,
      });

      return {
        status: 200,
        body: undefined,
      };
    },
  },
});
