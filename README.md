# [The Apollos Project](https://apollosapp.io)

## Develop

First, run through the [React Native environment setup instructions](https://reactnative.dev/docs/environment-setup) for iOS and Android. **Make sure you're using the React Native CLI section, not Expo.**

Then, install dependencies for all the front-end packages

```
yarn
```

Next, go into the app template folder and get the bundler up and running:

```
cd templates/mobile
yarn && yarn start
```

Add the server URL to a `.env` file

```
templates/mobile/.env
*********************

APP_DATA_URL=https://apollos-demo.staging.apollos.app
```

Lastly, in a new tab, run the command to boot up the simulator

```
yarn ios
```

Any of the `apollos-ui-*` folders are React Native code and when edited, will reload the app bundle. Now all that's left is to submit a PR!
