import { z } from 'zod';

const workspaceSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().nullable(),
  domain: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const workspaceSchemas = {
  workspace: workspaceSchema,
};
