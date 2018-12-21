import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

const { ONE_SIGNAL } = ApollosConfig;

export default class OneSignal extends RESTDataSource {
  baseURL = 'https://onesignal.com/api/v1/';

  async updateExternalUserId({ pushId, userId }) {
    return this.put(`players/${pushId}`, {
      app_id: ONE_SIGNAL.APP_ID,
      external_user_id: userId,
    });
  }

  async updatePushSettings({ enabled, pushId }) {
    const currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    if (enabled != null) {
      // TODO: Allow a user to disable push notifications
    }
    if (pushId != null) {
      await this.updateExternalUserId({ pushId, userId: currentUser.id });
    }
    return currentUser;
  }
}
