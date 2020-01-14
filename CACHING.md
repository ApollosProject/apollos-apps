# Caching Overview

## The Need for Caching

The Apollos App uses Rock as its primary source of data. For every request that is made to the Apollos API, a number of separate Requests are made to Rock. Because of this, as the latency to Rock increases (because of increased load on the Rock servers) we see an exaggerated impact on the response time of our API. In many cases, we don't have the option of reducing the number of requests we make to Rock, nor do we have any control over optimizing the speed of the Rock API. Thus, we need to reduce the number of requests we make to Rock by returning data we already have, as often as possible.

## Caching Strategies

We implement three unique and specific layers of caching. Each layer serves a different role, and has different strengths and weaknesses. We'll try and cover them all here.

### Fastly / GraphQL

#### When and Why?

We use a feature of `ApolloServer` that allows you to annotate your schema with "cache hints". Any request to our GraphQL server (that isn't a mutation) will be responded to with cache hints **equal to the lowest cache hint for the entire request**.

These cache hints are standard [HTTP Cache-Control headers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#max-age). Because these headers are set on a per-request level, instead of a per-field level, i you add a field to your request that is marked as uncachable, or with an extremely low max age, the entire request won't be cached.

Because of this, it's very important that as a client developer you pay attention to these hints in the schema. You could make a very performant API request very slow (and costly) by adding a single, uncachable field!

Uncachable fields tend to fall into two camps:
- Fields whose data is expected to change over time.
- Fields which are personal to a specific user.

The actual caching is achieved through [Fastly](https://www.fastly.com/). Fastly is _CDN_ that all requests and responses to the GraphQL API pass through. Fastly pays attention to the max-age headers, and if a response includes a max-age header, it caches that request for the length of time in the header. If another identical request is recieved, Fastly returns the request it has stored instead of hitting the server. The Apollos server will actually never see the request.

As a "Master Cacher", this should be your first line of defense. If you can add cache hints to your query, or modify your query so it doesn't include any uncachable fields, do it! This level of caching is the fastest for the end user, has zero cost on the server, and doesn't require any complex code changes.

#### How?

Configuration needs to happen in two places.

`ApolloServer` - You'll need to enable sending the maxAge headers on your API. This is enabled by default with the `ApollosServer`, but you can see more documentation [here](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserver).

`Schema Hints` - The Apollo API ships with some reasonable defaults around hints. However, for any new fields you add or new types you create, you'll want to change the maxAge using  cacheHints to match your needs. The "how" can be found in the [Apollo Docs](https://www.apollographql.com/docs/apollo-server/performance/caching/#defining-cache-hints)

`Fastly` - We have information on how to setup Fastly [here](https://apollosapp.io/docs/fastly)

### Apollo DataSource Cache

#### When and Why?

The Apollos DataSource Cache is a tool provided by the [Apollo Rest DataSource](https://www.apollographql.com/docs/apollo-server/data/data-sources/#rest-data-source) This caching mechanism will cache the results of requests made by our rock data source methods, but only if you specify a `ttl` using the request builder. This cache will also cache the results of requests whose results include standard cache-control/max-age headers.

The results from this caching layer are all stored in server memory by default, but results can also be stored in `redis` or `memcached` with the right setup.

This cache source is useful in a few specific scenarios. It's nice when you know a specific resource will be fetched multiple times in a short span of time; it's useful to add granular caching to data that isn't cacheable through Fastly / GraphQL It's also useful if you are consuming an API that does return caching related headers. It's also a good caching option if you are already using the request builder, because it's a one line change to introduce caching However, this isn't a good caching option if you need data cached for a longer length of time, or if you need control over the data in the cache. For that, explore the next cache option.

#### How?

To cache data when using the request builder, add a `.cache()` to the request chain you are building.

Example:
```
const slug = await this.request('ContentChannelItemSlugs')
  .filter(`ContentChannelItemId eq ${contentId}`)
  .cache({ ttl: 60 })
  .first();
```

### Custom Cache DataSource

#### When and Why?

For more control, and to fill in the gaps in our caching strategy, we built a custom data source to cache with a high level of granularity. This cache source requires the most code of all the solutions to cache data, but the programmer has full control over the key the data is cached under, the data being cached, and the length that data is cached. This source can almost be considered a database for data that will be accessed frequently. Data is conveniently stored in Redis, so any data cached on one server will be available to all servers.

Use this data source if you know you need to cache data that is difficult to cache, and thus requires a lot of control to cache. You can also use this data source if you want to cache something, and then need to have control over the data potentially stored in the cache down the road (like liking content items).

#### How?

If you are using the Apollos API in a "out of the box" setup, you'll have a `DataSource` called `Cache` included out of the box.

```
const { Cache } = context.dataSources;

// Gets a value, if it exists.
Cache.get({ key: String|Array })

// Sets a value
Cache.set({ key: String|Array, data: (Any JSON serializable data), expiresIn: (Seconds, optionally)  })

// Increments a value by 1
Cache.increment({ key: String|Array  })

// Decrements a value by 1
Cache.decrement({ key: String|Array  })
```
