# `@apollosproject/data-connector-onesignal`

Provides a connector to OneSignal for updating user data in OneSignal. This package (at this time) does not send push notifications, but rather sets up users in OneSignal so push notifications can be sent to them via the Rest API or OneSignal dashboard.


## Dependants / Dependencies

None at this time. However, we do some special magic in the `apollos-church-api` app to demonstrate how you can capture the OneSignal ID and save it in Rock. If you look in `src/data/oneSignalWithRock` you can see the following example:

```
/* eslint-disable import/prefer-default-export */

export const resolver = {
  Mutation: {
    updateUserPushSettings: async (root, { input }, { dataSources }) => {
      // register the changes w/ one signal
      const returnValue = await dataSources.OneSignal.updatePushSettings(input);

      // if the pushProviderUserId is changing, we need ot register the device with rock.
      if (input.pushProviderUserId != null) {
        await dataSources.PersonalDevice.addPersonalDevice({
          pushId: input.pushProviderUserId,
        });
      }

      // return the original return value (which is currentPerson)
      return returnValue;
    },
  },
};

```

Here we are overriding the `updateUserPushSettings` resolver defined in this module, capturing the return of this module's data source call (which updates a OneSignal user) and puts their PushId in Rock so Rock can send the user push notifications.

If using OneSignal with Rock, we recommend you copy the above code and use it in conjunction with the OneSignal communication module that NewSpring Church is developing.

## Usage

In your `src/data/index`,

```
import * as OneSignal from '@apollosproject/data-connector-onesignal';

...

const data = {
  ...
  OneSignal,
  ...
}
```

Implementing this module requires you also follow the steps to add OneSignal to your client app. Start by implementing OneSignal as outlined in this documentation.

https://documentation.onesignal.com/docs/react-native-sdk-setup

Next, you should mimic the config we wrote which sends PlayerID's to our API once they are received OneSignal gets them from the client.

```
import gql from 'graphql-tag';
import { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { client } from '../client';

const UPDATE_DEVICE_PUSH_ID = gql`
  mutation updateDevicePushId($pushId: String!) {
    updateDevicePushId(pushId: $pushId) @client
  }
`;

export default class NotificationsInit extends Component {
  componentDidMount() {
    OneSignal.init(Config.ONE_SIGNAL_KEY, {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure();
  }

  ...

  componentWillUnmount() {
    OneSignal.removeEventListener('ids');
  }

  onIds = (device) => {
    client.mutate({
      mutation: UPDATE_DEVICE_PUSH_ID,
      variables: { pushId: device.userId },
    });
  };

  ...
}
```