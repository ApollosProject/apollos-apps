import { PostgresDataSource } from '../postgres';

class NotificationPreferencesDataSource extends PostgresDataSource {
  modelName = 'notificationPreferences';

  async updateNotificationPreferences({
    personId,
    notificationProviderType,
    notificationProviderId,
    enabled = true,
  }) {
    return this.model.upsert({
      personId,
      notificationProviderType,
      notificationProviderId,
      enabled,
    });
  }
}

export { NotificationPreferencesDataSource as default };
