import { env } from '@/config/env.config';
import { JobsOptions, Queue, type ConnectionOptions } from 'bullmq';

export type GenerateArticleJobData = {
  amount: number;
};

const connection: ConnectionOptions = {
  url: env.REDIS_URL,
};

export const ARTICLE_QUEUE_NAME = 'generate-health-food-article';

export const articleQueue = new Queue<GenerateArticleJobData>(ARTICLE_QUEUE_NAME, { connection });

export const addGenerateArticleJob = async (
  data: GenerateArticleJobData,
  options?: JobsOptions,
) => {
  await articleQueue.add(ARTICLE_QUEUE_NAME, data, {
    jobId: `health-article-job-${Date.now()}`,
    ...options,
  });
};
