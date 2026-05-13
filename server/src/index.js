import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import redisService from './redis/redisService.js';
import registerRoutes from './routes/index.js';

const PORT = parseInt(process.env.PORT) || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 30;
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000;

const fastify = Fastify({
  logger: false,
  trustProxy: true,
});

async function bootstrap() {
  await fastify.register(cors, {
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  });

  await fastify.register(rateLimit, {
    max: RATE_LIMIT_MAX,
    timeWindow: RATE_LIMIT_WINDOW,
    errorResponseBuilder: () => ({
      success: false,
      error: 'Too many requests. Please slow down.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
    }),
  });

  try {
    await redisService.connect();
    await redisService.ping();
  } catch (err) {
    process.stderr.write(`[SnapSL] Redis connection failed: ${err.message}\n`);
    process.exit(1);
  }

  await registerRoutes(fastify);

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Not found',
      path: request.url,
    });
  });

  fastify.setErrorHandler((error, request, reply) => {
    reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || 'Internal server error',
    });
  });

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
}

bootstrap().catch((err) => {
  process.stderr.write(`[SnapSL] Fatal startup error: ${err.message}\n`);
  process.exit(1);
});