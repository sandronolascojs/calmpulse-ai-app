import { publicRouter } from './public.contract.js';
import { slackRouter } from './slack.contract.js';
import { workspaceRouter } from './workspace.contract.js';

export const contract = {
  publicContract: publicRouter,
  slackContract: slackRouter,
  workspaceContract: workspaceRouter,
};
