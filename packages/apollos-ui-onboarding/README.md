# Apollos UI: OnBoarding

React Native components to create an Onboarding experience.

## Installation

This package should be in your Apollo's Client if you got started with the example repo. For an example implmentation, check the `apolloschurchapp`.

## Usage

This package lets you configure onboarding in three different ways.

### 1. Use the built in connected components.

The "connected components" are built to work for the majority of use cases. They rely on an unmodified schema, but will probabbly work if you made additions or subtle changes.

To use these components, import them from the `@apollosproject/ui-onboarding` package and compose them into the main slider.

```
import {
  AskNotificationsConnected,
  AskNameConnected,
  FeaturesConnected,
  AboutYouConnected,
  LocationFinderConnected,
  OnboardingSwiper,
} from '@apollosproject/ui-onboarding';
...
function Onboarding({ navigation }) {
  return (
    <OnboardingSwiper>
      {({ swipeForward }) => (
        <>
          <AskNameConnected onPressPrimary={swipeForward} />
          <FeaturesConnected
            onPressPrimary={swipeForward}
            BackgroundComponent={
              <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
            }
          />
          <AboutYouConnected
            onPressPrimary={swipeForward}
            BackgroundComponent={
              <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
            }
          />
          <LocationFinderConnected
            onPressPrimary={swipeForward}
            onNavigateToLocationFinder={() => {
              navigation.navigate('Location', {
                onFinished: swipeForward,
              });
            }}
            BackgroundComponent={
              <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
            }
          />
          <ApolloConsumer>
            {(client) => (
              <AskNotificationsConnected
                onPressPrimary={() => navigation.navigate('Home')}
                onRequestPushPermissions={() =>
                  requestPushPermissions({ client })
                }
                primaryNavText={'Finish'}
                BackgroundComponent={
                  <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
                }
              />
            )}
          </ApolloConsumer>
        </>
      )}
    </OnboardingSwiper>
  );
}
```

As you can see, each of the connected components may require specific props that may change depending on how your app is implemented. The notifications connected component right now is a little hairy, but that will be fixed in the future with a `ui-notifications` package.

### 2. Use the built in visual components, but "connect them" yourself.

This is the best strategy if you wish to change the schema or mutations for your components, but don't want to change the way the components look or function.

The aproach is roughly the same as above, but you will have to define your `connected` components locally. You can import the underlying visual components from the `ui-onboarding` package by importing without `Connected`. IE: `import { ConnectedAskName } ...` becomes `import { AskName } ...`.

### 3. Use our component building blocks to build your own new Onboarding slides.

This is the most advanced implementation, but gives the most control. You can import the `<Slide>` component (whose props are documented in PropTypes) to construct your very own slide. You can look at the slides defined in this package for reference on how to construct a custom slide.


## Exported Components.

### OnboardingSwiper

No props are needed. The first and only child should be a callback function which is called passing the arg `({ swipeForward })`. Calling swipe forward imperatively will move the onboarding slider forward by one slide. The callback function should return

A. A `React.Fragment` with each slide `node` as a child.
B. An array of slide `nodes`.

Looking for more flexibility? Want to jump to a specific slide or swipe back. Checkout the `scrollBy` arg.

### [AskName](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/AskName/AskName.js), [AskNameConnected](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/AskName/AskNameConnected.js)

### [AskNotifications](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/AskNotifications/AskNotifications.js), [AskNotificationsConnected](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/AskNotifications/AskNotificationsConnected.js)

### [AboutYou](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/AboutYou/AboutYou.js), [AboutYouConnected](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/AboutYou/AboutYouConnected.js)

### [LocationFinder](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/LocationFinder/LocationFinder.js), [LocationFinderConnected](https://github.com/ApollosProject/apollos-prototype/blob/master/packages/apollos-ui-onboarding/src/slides/LocationFinder/LocationFinderConnected.js)

