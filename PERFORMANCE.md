# Performance

We would love to be able to tell you, based on how many physical attendees you have, how you should spec your Apollos servers to be able to handle all load. There are innumerable variables that can make even seemingly reasonable comparison inapplicable. How many of your attendees will actually use the app? How is reception inside your sanctuary? How is your Rock instance specced? Do you perform a lot of rock background jobs in response to certain actions?

With that out of the way, there are certain guidelines that we can provide for churches looking to use Apollos, based on our experience running Apollos for live churches.

### Case #1 - Very Large Church with highly customized Rock Instance and highly customized Apollos

This church uses 5 PM1 Heroku dynos for their Apollos server, and uses a 32GB RAM, 16vcpu Rock Server ([Azure Standard F16s_v2](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-compute)). The PM1 dynos are a a nice option for this church, because it allows the app to scale up to meet additional demand when the app is, for example, promoted on stage during a service.

During a sampled service, the app had a max p95 response time of 27,649ms, a median p50 response time of 159ms, and a max throughput of 6rps. During roughly that same time, about 40% of all requests were served from the Cache, and 69.7k total requests were made from client devices.


### Case #2 - Very Large Church with close to lightly customized Rock and close to core Apollos

This church uses 5 Standard 1x Heroku dynos for their Apollos server, and uses a 32GB RAM, 8vcpu Rock Server.

During a sampled service, the app had a max p95 response time of 3,839ms, a median p50 response time of 335ms, and a max throughput of 17rps. During roughly that same time, about 29.9% of all requests were served from the Cache, and 81.2k total requests were made from client devices.

## I'm spinning up a new Apollos instance, what should I expect?

Some things to keep in mind, is that the Apollos server spends most of it's compute time / memory requesting data from Rock, and then returning that data to the client. Each request that is made to the Apollos server will result in anywhere from 1 -> 10+ requests to Rock (but hopefully closer to 1). Under extreme load, you'll see Response times to Rock start to drop, causing a cascading increase in response times across Apollos.

To mitigate this, there are three things you can do to prepare:

1. Keep your caching percentages high. Cache aggressively. See [CACHING.md for more details](./CACHING.md.)

2. Have a beefy Rock server. You'll get more bang for your buck scaling Rock, then you will scaling the Apollos API. See the example server configurations above for starting points.

3. Scale Apollos Horizontally. The battle we fight under load is to hold onto as many requests as possible, so that that we can process them before they timeout. Scaling horizontally (adding more servers, instead of bigger serves) helps the most with this effort.

## What are my target performance metrics?

This is a hard question to answer at this time, due to the vast variety of possible Rock configurations and Apollos setups. In general, however, *we aim to get the median p50 response time in Heroku under 1 second*. Combined with a high percentage of data being resolved from the Cache, we have found that meeting that target results in a user experience that isn't effected by server performance. You can expect to see spikes of response times above 1 seconds, but again, we aim to keep the p50 low rather than the p99. We see enough random spikes in Rock response times (possibly due to background jobs being processed) to aim for super low p99s.


## Tables

|                      | Dyno Setup      | Rough Sunday Performance - Max Memory Usage | Rough Sunday Performance - Max p95 Response Time | Rough Sunday Performance - Median p50 Response Time | Rough Sunday Performance - Max Throughput | Rough Sunday Performance - Hit Ratio | Rough Sunday Performance - Cache Coverage | Rough Sunday Performance - Total Requests | Rough Sunday Peformance - Cache Misses + Passes | Rock Server Memory | Rock Server CPU | Rock Server Description |
|----------------------|-----------------|---------------------------------------------|--------------------------------------------------|-----------------------------------------------------|-------------------------------------------|--------------------------------------|-------------------------------------------|-------------------------------------------|-------------------------------------------------|--------------------|-----------------|-------------------------|
| Very Large Church #2 | 5 x Standard 1x | 24.30%                                      | 3839ms                                           | 335ms                                               | 17rps                                     | 29.97%                               | 39.28%                                    | 81.2k                                     | 72.4k                                           | 32 GB              | 8 vcpus         |                         |
| Very Large Church #1 | 5-7 PM1         | 31.20%                                      | 27,647ms                                         | 159ms                                               | 6rps                                      | 41.19%                               | 55.54%                                    | 69.7k                                     | 50.9k                                           | 32 GB              | 16 vcpus        | Azure Standard F16s_v2  |