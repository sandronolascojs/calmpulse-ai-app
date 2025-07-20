import { env } from '@/config/env.config';
import { FastifyCorsOptions } from '@fastify/cors';

export const MAX_AGE = 86400; // 24 hours

export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export const corsConfig: FastifyCorsOptions = {
  origin: env.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: MAX_AGE,
  exposedHeaders: Object.keys(securityHeaders),
};
