import { getOrAllocateToken } from '../allocator/tokenAllocator.js';
import { generateQRPng, generateQRSvg } from '../qr/qrService.js';
import { validateUrl } from '../middleware/urlValidator.js';
import redisService from '../redis/redisService.js';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

async function shortenController(request, reply) {
  const { url: rawUrl, mode = 'link' } = request.body;

  const validation = validateUrl(rawUrl);
  if (!validation.valid) {
    return reply.status(400).send({
      success: false,
      error: validation.error,
    });
  }

  const validatedUrl = validation.url;
  const response = { success: true };

  try {
    if (mode === 'qr') {
      // Sirf QR — original URL ka QR, koi short link nahi
      const [qrPng, qrSvg] = await Promise.all([
        generateQRPng(validatedUrl),
        generateQRSvg(validatedUrl),
      ]);
      response.originalUrl = validatedUrl;
      response.qr = { png: qrPng, svg: qrSvg };

    } else if (mode === 'link') {
      // Sirf short link
      const { token, normalizedUrl, isNew } = await getOrAllocateToken(validatedUrl);
      const shortUrl = `${BASE_URL}/SL/${token}`;
      const ttlSeconds = await redisService.getTokenTTL(token);

      response.shortUrl = shortUrl;
      response.token = token;
      response.originalUrl = normalizedUrl;
      response.isNew = isNew;
      response.expiresIn = ttlSeconds;
      response.expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

    } else if (mode === 'both') {
      // Short link + QR of original URL
      const { token, normalizedUrl, isNew } = await getOrAllocateToken(validatedUrl);
      const shortUrl = `${BASE_URL}/SL/${token}`;
      const ttlSeconds = await redisService.getTokenTTL(token);

      const [qrPng, qrSvg] = await Promise.all([
        generateQRPng(normalizedUrl),  // original URL ka QR
        generateQRSvg(normalizedUrl),
      ]);

      response.shortUrl = shortUrl;
      response.token = token;
      response.originalUrl = normalizedUrl;
      response.isNew = isNew;
      response.expiresIn = ttlSeconds;
      response.expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
      response.qr = { png: qrPng, svg: qrSvg };
    }

    return reply.status(200).send(response);
  } catch {
    return reply.status(500).send({
      success: false,
      error: 'Internal server error. Please try again.',
    });
  }
}

async function redirectController(request, reply) {
  const { token } = request.params;

  if (!token || token.length > 5) {
    return reply.status(404).send({ error: 'Invalid link' });
  }

  try {
    const originalUrl = await redisService.getLongUrl(token);

    if (!originalUrl) {
      return reply.status(410).send({
        error: 'This link has expired or does not exist.',
        code: 'LINK_EXPIRED',
      });
    }

    return reply.redirect(302, originalUrl);
  } catch {
    return reply.status(500).send({ error: 'Server error' });
  }
}

async function infoController(request, reply) {
  const { token } = request.params;

  if (!token) {
    return reply.status(400).send({ error: 'Token required' });
  }

  try {
    const originalUrl = await redisService.getLongUrl(token);
    if (!originalUrl) {
      return reply.status(404).send({ error: 'Link not found or expired' });
    }

    const ttlSeconds = await redisService.getTokenTTL(token);

    return reply.send({
      token,
      shortUrl: `${BASE_URL}/SL/${token}`,
      originalUrl,
      expiresIn: ttlSeconds,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    });
  } catch {
    return reply.status(500).send({ error: 'Server error' });
  }
}

export { shortenController, redirectController, infoController };