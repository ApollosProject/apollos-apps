/* eslint-disable no-console */
import { DataSource } from 'apollo-datasource';
import Redis from 'ioredis';

let REDIS;

const parseKey = (key, prefix = '') => {
  if (Array.isArray(key)) {
    return key.join(':');
  }
  const prefixWithSeparator = prefix ? `${prefix}:` : '';
  return `${prefixWithSeparator}${key}`;
};

export default class Cache extends DataSource {
  constructor(...args) {
    super(...args);
    // Memoize the REDIS instance so the connection can be resued.
    if (process.env.REDIS_URL && !REDIS) {
      REDIS = new Redis(process.env.REDIS_URL, {
        keyPrefix: `apollos-cache-${process.env.NODE_ENV}`,
        ...(process.env.REDIS_URL.includes('rediss')
          ? {
              tls: {
                rejectUnauthorized: false,
              },
            }
          : {}),
      });
    }
    this.redis = REDIS;
  }

  initialize({ context }) {
    this.context = context;
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
      this.redis.set(
        parseKey(key, this.context.church?.slug),
        JSON.stringify(data),
        'EX',
        expiresIn
      )
    );
  }

  async get({ key }) {
    return this.safely(async () => {
      const data = await this.redis.get(
        parseKey(key, this.context.church?.slug)
      );
      return JSON.parse(data);
    });
  }

  async increment({ key }) {
    return this.safely(() =>
      this.redis.incr({ key: parseKey(key, this.context.church?.slug) })
    );
  }

  async decrement({ key }) {
    return this.safely(() =>
      this.redis.decr({ key: parseKey(key, this.context.church?.slug) })
    );
  }
}
