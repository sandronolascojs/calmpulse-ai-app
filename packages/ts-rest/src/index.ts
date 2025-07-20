import { publicRouter } from './public.contract';
import { slackRouter } from './slack.contract';
import { workspaceRouter } from './workspace.contract';

export const contract: {
  publicContract: typeof publicRouter;
  slackContract: typeof slackRouter;
  workspaceContract: typeof workspaceRouter;
} = {
  publicContract: publicRouter,
  slackContract: slackRouter,
  workspaceContract: workspaceRouter,
};
