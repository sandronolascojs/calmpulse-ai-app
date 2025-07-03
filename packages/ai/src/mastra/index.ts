import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { HealthFoodArticleGeneratorAgent } from './agents';
export * from './agents';

export const agents = {
  healthFoodArticleGeneratorAgent: new HealthFoodArticleGeneratorAgent().getAgent(),
};

export const mastra: Mastra = new Mastra({
  agents,
  storage: new LibSQLStore({
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    enabled: true,
    serviceName: 'auto-articles',
    tracerName: 'auto-articles',
  },
});
