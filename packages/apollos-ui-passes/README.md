# Apollos UI: Passes

Display and download Apollos passes in your app!

## Installation:

`@apollosproject/data-connector-passes` is required on your GraphQL instance. See that package for installation instructions.

1. Install library and peer dependencies from `npm`:

```
yarn add @apollosproject/apollos-ui-passes react-native-passkit-wallet rn-fetch-blob
```

2. Link native dependencies

```
yarn run react-native link
```

## Usage

This package exports two components:

1. A plug-and-play data-connected "route" that you can add right to your `@react-navigation/native` router:

```
import Passes from '@apollosproject/apollos-ui-passes`;

const AppNavigator = createStackNavigator(
  {
    Passes,
  }
);
```

Navigating to this route will open a full-screen view with your pass in the center and an "Add to Apple Wallet" button.

2. A basic, `PassView` component

```
<PassView
  description={String}
  thumbnail={Object}
  barcode={Object}
  primaryFields={Array}
  secondaryFields={Array}
  backgroundColor={String}
  foregroundColor={String}
  labelColor={String}
  isLoading={Boolean}
/>
```

You could hook this component up to a `<Query>` if you want to render your own passes elsewhere in your Apollos App.