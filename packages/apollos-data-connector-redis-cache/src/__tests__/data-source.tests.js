import { dataSource as Cache } from '../index';

describe('Redis Cache', () => {
  it('constructs with Redis', () => {
    const cache = new Cache();
    expect(cache).toMatchSnapshot();
    cache.redis.disconnect();
  });
  it('gets data from redis', async () => {
    const cache = new Cache();
    cache.redis.get = jest.fn(() =>
      Promise.resolve(JSON.stringify({ foo: 'bar' }))
    );

    const result = await cache.get({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    expect(cache.redis.get.mock.calls).toMatchSnapshot();
    cache.redis.disconnect();
  });
  it('safely handle thrown errors in get', async () => {
    const cache = new Cache();
    cache.redis.get = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.get({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    cache.redis.disconnect();
  });
  it('sets data in redis', async () => {
    const cache = new Cache();
    cache.redis.set = jest.fn(() => Promise.resolve());

    const result = await cache.set({ key: 'someKey', data: true });

    expect(result).toMatchSnapshot();
    expect(cache.redis.set.mock.calls).toMatchSnapshot();
    cache.redis.disconnect();
  });
  it('sets data in redis using an array key', async () => {
    const cache = new Cache();
    cache.redis.set = jest.fn(() => Promise.resolve());

    const result = await cache.set({
      key: ['someKey', 'some specific-id'],
      data: true,
    });

    expect(result).toMatchSnapshot();
    expect(cache.redis.set.mock.calls).toMatchSnapshot();
    cache.redis.disconnect();
  });
  it('safely handle thrown errors in set', async () => {
    const cache = new Cache();
    cache.redis.set = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.set({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    cache.redis.disconnect();
  });
  it('increments integers in redis', async () => {
    const cache = new Cache();
    cache.redis.incr = jest.fn(() => Promise.resolve(2));

    const result = await cache.increment({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    expect(cache.redis.incr.mock.calls).toMatchSnapshot();
    cache.redis.disconnect();
  });

  it('safely swallows errors when incrementing', async () => {
    const cache = new Cache();
    cache.redis.incr = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.increment({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    cache.redis.disconnect();
  });

  it('decrements integers in redis', async () => {
    const cache = new Cache();
    cache.redis.decr = jest.fn(() => Promise.resolve(2));

    const result = await cache.decrement({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    expect(cache.redis.decr.mock.calls).toMatchSnapshot();
    cache.redis.disconnect();
  });

  it('safely swallows errors when decrementing', async () => {
    const cache = new Cache();
    cache.redis.decr = jest.fn(() => {
      throw new Error('Some Error');
    });

    const result = await cache.decrement({ key: 'someKey' });

    expect(result).toMatchSnapshot();
    cache.redis.disconnect();
  });
});
