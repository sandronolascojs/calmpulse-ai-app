import { env } from '@/config/env.config';
import { HealthFoodArticleGeneratorAgent } from '@calmpulse-app/ai/src/mastra';
import { Worker } from 'bullmq';
import { GenerateHealthContentService } from '../services/healthContent.service';
import { logger } from '../utils/logger.instance';
import { mastraInstance } from '../utils/mastra.instance';
import { ARTICLE_QUEUE_NAME, GenerateArticleJobData } from './articleQueue';

export const startArticleWorker = () => {
  return new Worker<GenerateArticleJobData>(
    ARTICLE_QUEUE_NAME,
    async (job) => {
      const agent = new HealthFoodArticleGeneratorAgent({
        mastra: mastraInstance,
      });
      const healthContentService = new GenerateHealthContentService(logger, agent);
      logger.info(`Processing job ${job.id} to generate ${job.data.amount} health articles`);
      await healthContentService.generateHealthArticle(job.data.amount);
      logger.info(`Completed job ${job.id} for health article generation`);
    },
    {
      connection: {
        url: env.REDIS_URL,
      },
    },
  );
};
