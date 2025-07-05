import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';
export * from './agents';

export const agents = {};

export const mastra: Mastra = new Mastra({
  agents,
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    enabled: true,
    serviceName: 'calmpulse-app',
    tracerName: 'calmpulse-app',
  },
});
