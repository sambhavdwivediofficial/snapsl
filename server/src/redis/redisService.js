import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const TTL_SECONDS = (parseInt(process.env.LINK_TTL_DAYS) || 100) * 86400;

export const KEYS = {
  SHORT_TO_LONG: (token) => `sl:s2l:${token}`,
  LONG_TO_SHORT: (hash)  => `sl:l2s:${hash}`,
  USED_TOKENS:             'sl:used_tokens',
  COUNTER:                 'sl:alloc:counter',
};

class RedisService {
  constructor() {
    this.client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    this.client.on('error', () => {});
  }

  async connect() {
    await this.client.connect();
  }

  async ping() {
    return this.client.ping();
  }

  async setShortToLong(token, originalUrl) {
    await this.client.setex(KEYS.SHORT_TO_LONG(token), TTL_SECONDS, originalUrl);
  }

  async setLongToShort(urlHash, token) {
    await this.client.setex(KEYS.LONG_TO_SHORT(urlHash), TTL_SECONDS, token);
  }

  async markTokenUsed(token) {
    await this.client.sadd(KEYS.USED_TOKENS, token);
  }

  async isTokenUsed(token) {
    return this.client.sismember(KEYS.USED_TOKENS, token);
  }

  async releaseToken(token) {
    await this.client.srem(KEYS.USED_TOKENS, token);
  }

  async getLongUrl(token) {
    return this.client.get(KEYS.SHORT_TO_LONG(token));
  }

  async getShortToken(urlHash) {
    return this.client.get(KEYS.LONG_TO_SHORT(urlHash));
  }

  async getAndIncrementCounter() {
    return this.client.incr(KEYS.COUNTER);
  }

  async getCounter() {
    const val = await this.client.get(KEYS.COUNTER);
    return val ? parseInt(val, 10) : 0;
  }

  async storeLink(token, originalUrl, urlHash) {
    const pipeline = this.client.pipeline();
    pipeline.setex(KEYS.SHORT_TO_LONG(token), TTL_SECONDS, originalUrl);
    pipeline.setex(KEYS.LONG_TO_SHORT(urlHash), TTL_SECONDS, token);
    pipeline.sadd(KEYS.USED_TOKENS, token);
    await pipeline.exec();
  }

  async tokenExists(token) {
    const exists = await this.client.exists(KEYS.SHORT_TO_LONG(token));
    return exists === 1;
  }

  async getTokenTTL(token) {
    return this.client.ttl(KEYS.SHORT_TO_LONG(token));
  }

  getClient() {
    return this.client;
  }
}

const redisService = new RedisService();
export default redisService;
export { TTL_SECONDS };