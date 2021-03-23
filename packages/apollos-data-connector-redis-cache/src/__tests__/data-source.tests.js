/* eslint-disable no-console */
import { dataSource as Cache } from '../index';

describe('Redis Cache', () => {
  it("doesn't constructs with Redis env url", () => {
    const cache = new Cache();
    expect(cache).toMatchSnapshot();
  });
  it('constructs with Redis env url', () => {
    process.env.REDIS_URL = 'localhost';
    const cache = new Cache();
    expect(cache).toMatchSnapshot();
    cache.redis.disconnect();
    delete process.env.REDIS_URL;
  });
  it('gets data from redis', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.get = jest.fn(() =>
      Promise.resolve(JSON.stringify({ foo: 'bar' }))
    );

    const result = await cache.get({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    expect(cache.redis.get.mock.calls).toMatchSnapshot();
  });
  it('safely handle thrown errors in get', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.get = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.get({ key: 'someKey' });

    expect(result).toMatchSnapshot();
  });
  it('safely handles no redis instance', async () => {
    const cache = new Cache();
    delete cache.redis;
    const result = await cache.get({ key: 'someKey' });
    expect(result).toMatchSnapshot();
  });
  it('sets data in redis', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.set = jest.fn(() => Promise.resolve());

    const result = await cache.set({ key: 'someKey', data: true });

    expect(result).toMatchSnapshot();
    expect(cache.redis.set.mock.calls).toMatchSnapshot();
  });
  it('sets data in redis using an array key', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.set = jest.fn(() => Promise.resolve());

    const result = await cache.set({
      key: ['someKey', 'some specific-id'],
      data: true,
    });

    expect(result).toMatchSnapshot();
    expect(cache.redis.set.mock.calls).toMatchSnapshot();
  });
  it('safely handle thrown errors in set', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.set = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.set({ key: 'someKey' });

    expect(result).toMatchSnapshot();
  });
  it('increments integers in redis', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.incr = jest.fn(() => Promise.resolve(2));

    const result = await cache.increment({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    expect(cache.redis.incr.mock.calls).toMatchSnapshot();
  });

  it('safely swallows errors when incrementing', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.incr = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.increment({ key: 'someKey' });

    expect(result).toMatchSnapshot();
  });

  it('decrements integers in redis', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.decr = jest.fn(() => Promise.resolve(2));

    const result = await cache.decrement({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    expect(cache.redis.decr.mock.calls).toMatchSnapshot();
  });

  it('safely swallows errors when decrementing', async () => {
    const cache = new Cache();
    cache.redis = {};
    cache.redis.decr = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.decrement({ key: 'someKey' });

    expect(result).toMatchSnapshot();
  });
});
