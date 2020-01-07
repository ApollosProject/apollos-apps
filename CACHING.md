# Caching Overview

## The Need for Caching

The Apollos App uses Rock as its primary source of data. For every request that is made to the Apollos API, a number of separate Requests are made to Rock. Because of this, as the latency to Rock increases (because of increased load on the Rock servers) we see an exaggerated impact on the response time of our API. In many cases, we don't have the option of reducing the number of requests we make to Rock, nor do we have any control over optimizing the speed of the Rock API. Thus, we

## Caching Strategies

### Fastly
request level caching. Caches whole requests, or none of the request. Super fast and best case scenario. Doesn’t cache personalized content.

### Apollos Cache

caches requests we make to rock in memory. Works pretty well, but we don’t use it in a lot of places so far. Hard to get insight into what’s being cached and what isn’t being cached. Configured by using the request builder and .ttl

### Redis

Caches data in Redis. Super manual, requires using the Cache data-source. Very configurable. Also update-able, so if you know a bit of data in the cache has changed, you can update the cache without needing to dump it and recreate it. Good for bits of the cache where you need a lot of control.