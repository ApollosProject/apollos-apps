# `@apollosproject/data-connector-redis-cache`

Provides a connector to Redis for storing data to improve performance.

## Dependants / Dependencies

Required by
- `Following` in `@apollosproject/data-connector-rock`

## Usage

The Cache dataSource implements the following methods:

```
// Gets a value, if it exists.
Cache.get({ key: String|Array })
// Sets a value
Cache.set({ key: String|Array, data: (Any JSON serializable data), expiresIn: (Seconds, optionally)  })
// Increments a value by 1
Cache.increment({ key: String|Array  })
// Decrements a value by 1
Cache.decrement({ key: String|Array  })
```

The key can be either a string like this: "some-key" or it can be an array of strings. Passing an array of strings is convenient, because you will often need to construct a key like: `isFollowing-${userId}-${nodeId}`, which can be simplified by passing `['isFollowing', userId, nodeId]`

