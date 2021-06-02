import { PostgresDataSource } from '../postgres';

class NotificationPreferencesDataSource extends PostgresDataSource {
  modelName = 'notificationPreferences';

  async updateNotificationPreferences({
    notificationProviderType,
    notificationProviderId,
    enabled = true,
    personId = null,
  }) {
    let finalPersonId = personId;
    if (!personId) {
      finalPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    }

    const [model] = await this.model.upsert({
      personId: finalPersonId,
      notificationProviderType,
      notificationProviderId,
      enabled,
    });
    return model;
  }
}

export { NotificationPreferencesDataSource as default };
