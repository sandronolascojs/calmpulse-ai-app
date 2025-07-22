import { errorsSchema, SlackEventsBodySchema } from '@calmpulse-app/types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

export const publicRouter = contract.router({
  health: {
    method: 'GET',
    path: '/health',
    responses: {
      200: z.object({
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
  },
  slackEvents: {
    method: 'POST',
    path: '/slack/events',
    headers: z.object({
      'x-slack-signature': z.string(),
      'x-slack-request-timestamp': z.string(),
    }),
    body: SlackEventsBodySchema,
    responses: {
      200: z.union([
        z.object({
          challenge: z.string(),
        }),
        z.void(),
      ]),
      ...errorsSchema,
    },
  },
});
