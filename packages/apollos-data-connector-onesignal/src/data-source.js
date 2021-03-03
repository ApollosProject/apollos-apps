import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

const { ONE_SIGNAL } = ApollosConfig;

export default class OneSignal extends RESTDataSource {
  baseURL = 'https://onesignal.com/api/v1/';

  willSendRequest = (request) => {
    request.headers.set('Authorization', `Basic ${ONE_SIGNAL.REST_KEY}`);
  };

  async updateExternalUserId({ playerId, userId }) {
    return this.put(`players/${playerId}`, {
      app_id: ONE_SIGNAL.APP_ID,
      external_user_id: userId,
    });
  }

  async createNotification({
    toUserIds = [],
    content = '',
    heading,
    subtitle,
  }) {
    return this.post('notifications', {
      app_id: ONE_SIGNAL.APP_ID,
      include_external_user_ids: toUserIds,
      contents: { en: content },
      headings: { en: heading },
      subtitle: { en: subtitle },
    });
  }

  async updatePushSettings({ enabled, pushProviderUserId }) {
    const { Auth, PersonalDevice, Person } = this.context.dataSources;
    const currentUser = await Auth.getCurrentPerson();
    const currentPerson = await Person.getFromId(currentUser.personId);

    if (enabled != null && pushProviderUserId != null)
      await PersonalDevice.updateNotificationsEnabled(
        pushProviderUserId,
        enabled
      );

    if (pushProviderUserId != null) {
      await this.updateExternalUserId({
        playerId: pushProviderUserId,
        userId: currentUser.primaryAliasId,
      });
    }
    return currentPerson;
  }
}
