import { Logger } from '@calmpulse-app/shared';
import { env } from '../config/env.config.js';

export const logger = new Logger({
  level: env.APP_ENV === 'development' ? 'debug' : 'info',
  serviceName: 'ai-background-service',
  isProd: env.APP_ENV === 'production',
});
