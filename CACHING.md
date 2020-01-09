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

### Apollos Cache

caches requests we make to rock in memory. Works pretty well, but we don’t use it in a lot of places so far. Hard to get insight into what’s being cached and what isn’t being cached. Configured by using the request builder and .ttl

### Redis

Caches data in Redis. Super manual, requires using the Cache data-source. Very configurable. Also update-able, so if you know a bit of data in the cache has changed, you can update the cache without needing to dump it and recreate it. Good for bits of the cache where you need a lot of control.