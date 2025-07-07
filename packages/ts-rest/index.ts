import { publicRouter } from './src/public.contract';
import { slack } from './src/slack.contract';
import { workspace } from './src/workspace.contract';

export const contract = {
  publicContract: publicRouter,
  slackContract: slack,
  workspaceContract: workspace,
};
