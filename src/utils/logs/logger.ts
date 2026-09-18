// lib/logs/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  // Automatically format logs locally, but keep fast JSON for production
  // transport: process.env.NODE_ENV === 'development'
  //   ? { target: 'pino-pretty', options: { colorize: true } }
  //   : undefined,
  redact: {
    paths: [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'authorization',
      'body.password', // Add common nested paths too
    ],
    censor: '[REDACTED]',
  },
});