import { PostgresDataSource } from '../postgres';

class NotificationPreferencesDataSource extends PostgresDataSource {
  modelName = 'notificationPreferences';

  async updateNotificationPreferences({
    personId,
    notificationProviderType,
    notificationProviderId,
    enabled = true,
  }) {
    const [model] = await this.model.upsert({
      personId,
      notificationProviderType,
      notificationProviderId,
      enabled,
    });
    return model;
  }
}

export { NotificationPreferencesDataSource as default };
