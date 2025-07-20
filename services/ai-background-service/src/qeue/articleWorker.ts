import { env } from '@/config/env.config';
import { Worker } from 'bullmq';
import { logger } from '../utils/logger.instance';
import { ARTICLE_QUEUE_NAME, GenerateArticleJobData } from './articleQueue';

export const startArticleWorker = () => {
  return new Worker<GenerateArticleJobData>(
    ARTICLE_QUEUE_NAME,
    async (job) => {
      logger.info(
        `Processing job ${job.id ?? 'unknown'} to generate ${job.data.amount} health articles`,
      );
      logger.info(`Completed job ${job.id ?? 'unknown'} for health article generation`);
    },
    {
      connection: {
        url: env.REDIS_URL,
      },
    },
  );
};
