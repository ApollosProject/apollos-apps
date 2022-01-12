import { RESTDataSource } from 'apollo-datasource-rest';

export default class OneSignal extends RESTDataSource {
  baseURL = 'https://onesignal.com/api/v1/';

  willSendRequest = (request) => {
    const { Config } = this.context.dataSources;
    request.headers.set('Authorization', `Basic ${Config.ONE_SIGNAL.REST_KEY}`);
  };

  async updateExternalUserId({ playerId, userId }) {
    const { Config } = this.context.dataSources;
    return this.put(`players/${playerId}`, {
      app_id: Config.ONE_SIGNAL.APP_ID,
      external_user_id: userId,
    });
  }

  async createNotification({
    toUserIds = [],
    content = '',
    heading,
    subtitle,
    ...args
  }) {
    const { Config } = this.context.dataSources;
    return this.post('notifications', {
      app_id: Config.ONE_SIGNAL.APP_ID,
      include_external_user_ids: toUserIds.map(String),
      contents: { en: content },
      headings: { en: heading },
      subtitle: { en: subtitle },
      ...args,
    });
  }

  async updatePushSettings({ enabled, pushProviderUserId }) {
    const { PersonalDevice, Person } = this.context.dataSources;
    const person = await Person.getCurrentPerson();

    // using the Rock PersonalDevice model to use the Rock request builder.
    const { primaryAliasId } = await PersonalDevice.request('People')
      .filter(`Id eq ${person.originId}`)
      .first();

    if (enabled != null && pushProviderUserId != null)
      await PersonalDevice.updateNotificationsEnabled(
        pushProviderUserId,
        enabled
      );

    if (pushProviderUserId != null) {
      await this.updateExternalUserId({
        playerId: pushProviderUserId,
        userId: primaryAliasId,
      });
    }
    return person;
  }
}
