import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

export const publicContract = contract.router({
  events: {
    method: 'POST',
    path: '/slack/events',
    body: z.union([
      z.object({ type: z.literal('url_verification'), challenge: z.string() }),
      z.object({
        type: z.literal('event_callback'),
        event: z.object({
          client_msg_id: z.string().nullable().optional(),
          user: z.string(),
          text: z.string().optional(),
          ts: z.string(),
        }),
      }),
    ]),
    headers: z.object({
      'x-slack-signature': z.string(),
      'x-slack-request-timestamp': z.string(),
    }),
    responses: {
      200: z.void(),
      400: z.string(),
      404: z.string(),
    },
  },
});