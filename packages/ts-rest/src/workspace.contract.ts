import { errorsSchema, workspaceSchemas } from '@calmpulse-app/types';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

const getWorkspaceSchema = z.object({
  workspace: workspaceSchemas.workspace.nullable(),
});

export const workspaceRouter = contract.router({
  getUserWorkspace: {
    method: 'GET',
    path: '/workspace/me',
    summary: "Get the current user's workspace",
    description: "Get the current user's workspace",
    responses: {
      200: getWorkspaceSchema,
      ...errorsSchema,
    },
  },
});
