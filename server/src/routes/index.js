import {
  shortenController,
  redirectController,
  infoController,
} from '../controllers/shortenController.js';

const shortenSchema = {
  body: {
    type: 'object',
    required: ['url'],
    properties: {
      url: { type: 'string', maxLength: 2048 },
      mode: { type: 'string', enum: ['link', 'qr', 'both'], default: 'link' },
    },
  },
};

async function registerRoutes(fastify) {
  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // Shorten URL / Generate QR
  fastify.post('/api/shorten', { schema: shortenSchema }, shortenController);

  // Get link info
  fastify.get('/api/info/:token', infoController);

  // Redirect short link
  fastify.get('/SL/:token', redirectController);
}

export default registerRoutes;
