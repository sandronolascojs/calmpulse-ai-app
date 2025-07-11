import { env } from '@/config/env.config';
import { FastifyCorsOptions } from '@fastify/cors';

export const MAX_AGE = 86400; // 24 hours

export const corsConfig: FastifyCorsOptions = {
  origin: env.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: MAX_AGE,
};
