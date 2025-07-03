import { agents, Mastra, PinoLogger } from '@calmpulse-app/ai';

export const mastraInstance = new Mastra({
  agents,
  logger: new PinoLogger({
    name: 'ai-background-service',
    level: 'info',
  }),
});
