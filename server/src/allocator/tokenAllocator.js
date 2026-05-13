import redisService from '../redis/redisService.js';

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function encodeBase(num) {
  let token = '';
  do {
    token = CHARS[num % CHARS.length] + token;
    num = Math.floor(num / CHARS.length);
  } while (num > 0);
  return token;
}

async function allocateNextToken() {
  while (true) {
    const counterVal = await redisService.getAndIncrementCounter();
    const index = counterVal - 1;
    const token = encodeBase(index);

    if (token.length > 5) {
      throw new Error('Token pool exhausted');
    }

    const exists = await redisService.tokenExists(token);
    if (!exists) {
      return token;
    }
  }
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url.trim());
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    let normalized = parsed.toString();
    if (normalized.endsWith('/') && parsed.pathname === '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return url.trim().toLowerCase();
  }
}

function hashUrl(url) {
  return Buffer.from(url).toString('base64url').slice(0, 128);
}

async function getOrAllocateToken(rawUrl) {
  const normalized = normalizeUrl(rawUrl);
  const urlHash = hashUrl(normalized);

  const existingToken = await redisService.getShortToken(urlHash);
  if (existingToken) {
    const stillValid = await redisService.tokenExists(existingToken);
    if (stillValid) {
      return { token: existingToken, normalizedUrl: normalized, isNew: false };
    }
  }

  const newToken = await allocateNextToken();
  await redisService.storeLink(newToken, normalized, urlHash);

  return { token: newToken, normalizedUrl: normalized, isNew: true };
}

export { getOrAllocateToken, normalizeUrl, hashUrl };