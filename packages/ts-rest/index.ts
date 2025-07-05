import { publicRouter } from './src/public.contract';
import { slack } from './src/slack.contract';

export const contract = {
  publicContract: publicRouter,
  slackContract: slack,
};
