/* eslint-disable no-console */
import { DataSource } from 'apollo-datasource';
import Redis from 'ioredis';

let REDIS;

const parseKey = (key) => {
  if (Array.isArray(key)) {
    return key.join(':');
  }
  return key;
};

export default class Cache extends DataSource {
  constructor(...args) {
    super(...args);
    // Memoize the REDIS instance so the connection can be resued.
    if (process.env.REDIS_URL && !REDIS) {
      REDIS = new Redis(process.env.REDIS_URL, {
        keyPrefix: `apollos-cache-${process.env.NODE_ENV}`,
      });
    }
    this.redis = REDIS;
  }

  // 24 hours in seconds.
  DEFAULT_TIMEOUT = 86400;

  safely = async (func) => {
    if (!this.redis) return null;
    try {
      // Redundent assignment because it makes sure the error is captured.
      const result = await func();
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  async set({ key, data, expiresIn = this.DEFAULT_TIMEOUT }) {
    return this.safely(() =>
      this.redis.set(parseKey(key), JSON.stringify(data), 'EX', expiresIn)
    );
  }

  async get({ key }) {
    return this.safely(async () => {
      const data = await this.redis.get(parseKey(key));
      return JSON.parse(data);
    });
  }

  async increment({ key }) {
    return this.safely(() => this.redis.incr({ key: parseKey(key) }));
  }

  async decrement({ key }) {
    return this.safely(() => this.redis.decr({ key: parseKey(key) }));
  }
}
