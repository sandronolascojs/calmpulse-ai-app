import { agents } from '@calmpulse-app/ai';
import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';

export const mastraInstance = new Mastra({
  agents,
  logger: new PinoLogger({
    name: 'ai-background-service',
    level: 'info',
  }),
});
