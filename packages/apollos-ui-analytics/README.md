# Apollos UI: Analytics

## Configuration

There is one configuration option available with this PR. You can add additional third party tracking libraries that are triggered anytime a track event from this library is triggered.

When implementing your provider, set the trackFunctions prop. For example, like this:
```
  <AnalyticsProvider trackFunctions={[console.warn]}>
    <Providers {...props} />
  </AnalyticsProvider>
```

This will call the `console.warn` function every time the analytics calls `track`. The properties passed are `{eventName: String, properties: Object }`.

You can do the same for identify using `identifyFunctions`. You must always pass an `array` of functions, even if you are only passing a single function.

## Usage

### From anywhere you have access to your apollo client variable...

```
import { track } from '@apollosproject/ui-analytics'

...

  track({ client, eventName, properties });
```

### From anywhere in the component tree under the AnalyticsProvider.

```
import { AnalyticsConsumer } from '@apollosproject/ui-analytics'

...

  <AnalyticsConsumer>
  ({ track, identify }) => (
    <Something onSomethingHappened={() => track({ eventName, properties })} />
  )
  </AnalyticsConsumer
```

### Using a component.
```
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics'

...

  <TrackEventWhenLoaded eventName="Something" properties={...someData} loaded={this.props.loaded} />
```

