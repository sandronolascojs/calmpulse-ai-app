import { contract } from '@calmpulse-app/ts-rest';
import { initServer } from '@ts-rest/fastify';

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
  events: {
    handler: async () => {
      return {
        status: 200,
        body: undefined,
      };
    },
  },
});
