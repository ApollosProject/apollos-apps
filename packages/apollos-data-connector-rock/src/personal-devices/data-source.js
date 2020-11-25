import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

export default class PersonalDevices extends RockApolloDataSource {
  resource = 'PersonalDevices';

  async addPersonalDevice({ pushId }) {
    if (!pushId) {
      throw new Error(
        'You must supply a `pushId` to the addPersonalDevice function'
      );
    }
    const existing = await this.request()
      .filter(`DeviceRegistrationId eq '${pushId}'`)
      .first();

    // if we already have a device, shortcut the function;
    const currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    if (existing) return currentUser;

    await this.post('/PersonalDevices', {
      PersonAliasId: currentUser.primaryAliasId,
      DeviceRegistrationId: pushId,
      PersonalDeviceTypeValueId:
        ApollosConfig.ROCK_MAPPINGS.MOBILE_DEVICE_TYPE_ID,
      NotificationsEnabled: 1,
      IsActive: 1,
    });

    return currentUser;
  }

  getByPersonAliasId(id) {
    return this.request().filter(`PersonAliasId eq ${id}`).get();
  }

  updateNotificationsEnabled = async (pushId, enabled) => {
    if (pushId === null || enabled === null)
      throw new Error("Device ID and 'enabled' required.");

    const {
      primaryAliasId,
    } = await this.context.dataSources.Auth.getCurrentPerson();

    const { id } = await this.request()
      .filter(`PersonAliasId eq ${primaryAliasId}`)
      .andFilter(`DeviceRegistrationId eq '${pushId}'`)
      .first();
    if (!id) throw new Error(`Device doesn't exist`);

    return this.patch(`/PersonalDevices/${id}`, {
      NotificationsEnabled: enabled,
    });
  };
}
