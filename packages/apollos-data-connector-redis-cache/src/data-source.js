import { DataSource } from 'apollo-datasource';
import Redis from 'ioredis';

const parseKey = (key) => {
  if (Array.isArray(key)) {
    return key.join(':');
  }
  return key;
};

const safely = async (func) => {
  try {
    // Redundent assignment because it makes sure the error is captured.
    const result = await func();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
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
    return safely(() =>
      this.redis.set(parseKey(key), JSON.stringify(data), 'EX', expiresIn)
    );
  }

  async get({ key }) {
    return safely(async () => {
      const data = await this.redis.get(parseKey(key));
      return JSON.parse(data);
    });
  }

  async increment({ key }) {
    return safely(() => this.redis.incr({ key: parseKey(key) }));
  }

  async decrement({ key }) {
    return safely(() => this.redis.decr({ key: parseKey(key) }));
  }
}
