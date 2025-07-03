import { env } from '@/config/env.config';
import { Logger } from '@calmpulse-app/utils';

export const logger = new Logger({
  serviceName: 'api',
  isProd: env.APP_ENV === 'production',
  level: env.APP_ENV === 'production' ? 'info' : 'debug',
});
