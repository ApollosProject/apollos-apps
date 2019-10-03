import { DataSource } from 'apollo-datasource';
import Redis from 'ioredis';

const parseKey = (key) => {
  if (Array.isArray(key)) {
    return key.join(':');
  }
  return key;
};

export default class Cache extends DataSource {
  constructor(...args) {
    super(...args);
    this.redis = new Redis(process.env.REDIS_URL, {
      keyPrefix: `apollos-cache-${process.env.NODE_ENV}`,
    });
  }

  // 24 hours in seconds.
  DEFAULT_TIMEOUT = 86400;

  async set({ key, data, expiresIn = this.DEFAULT_TIMEOUT }) {
    try {
      return this.redis.set(
        parseKey(key),
        JSON.stringify(data),
        'EX',
        expiresIn
      );
    } catch (e) {
      console.error(e);
    }
  }

  async get({ key }) {
    try {
      const data = await this.redis.get(parseKey(key));
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }

  async increment({ key }) {
    try {
      return this.redis.incr({ key: parseKey(key) });
    } catch (e) {
      console.error(e);
    }
  }

  async decrement({ key }) {
    try {
      return this.redis.decr({ key: parseKey(key) });
    } catch (e) {
      console.error(e);
    }
  }
}
