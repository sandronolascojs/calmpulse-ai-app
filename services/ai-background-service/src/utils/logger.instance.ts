import { env } from '@/config/env.config';
import { Logger } from '@calmpulse-app/shared';

export const logger = new Logger({
  level: env.APP_ENV === 'development' ? 'debug' : 'info',
  serviceName: 'ai-background-service',
  isProd: env.APP_ENV === 'production',
});
