import { PostgresDataSource } from '../postgres';

class NotificationPreferencesDataSource extends PostgresDataSource {
  modelName = 'notificationPreferences';

  async updateNotificationPreference({
    notificationProviderType,
    notificationProviderId,
    enabled = true,
    personId = null,
  }) {
    const [model] = await this.model.upsert({
      personId,
      notificationProviderType,
      notificationProviderId,
      enabled,
    });
    return model;
  }

  async updateUserNotificationPreference(input) {
    const personId = await this.context.dataSources.Person.getCurrentPersonId();
    await this.updateNotificationPreference({ ...input, personId });
    return this.context.dataSources.Person.getFromId(personId);
  }
}

export { NotificationPreferencesDataSource as default };
