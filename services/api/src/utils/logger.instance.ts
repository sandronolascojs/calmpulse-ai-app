import { env } from '@/config/env.config.js';
import { Logger } from '@calmpulse-app/shared';

export const logger = new Logger({
  serviceName: 'api',
  isProd: env.APP_ENV === 'production',
  level: env.APP_ENV === 'production' ? 'info' : 'debug',
});
