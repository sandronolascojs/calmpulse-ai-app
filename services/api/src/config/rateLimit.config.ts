import { StatusCode } from '@/utils/errors/statusCode.enum';
import { RateLimitOptions } from '@fastify/rate-limit';

const MAX_REQUESTS = 100;
const TIME_WINDOW = '10 minutes';

export const rateLimitConfig: RateLimitOptions = {
  max: MAX_REQUESTS,
  timeWindow: TIME_WINDOW,
  errorResponseBuilder() {
    return {
      statusCode: StatusCode.TOO_MANY_REQUESTS,
      message: 'Too many requests, please try again later.',
      error: 'Rate limit exceeded',
    };
  },
};
