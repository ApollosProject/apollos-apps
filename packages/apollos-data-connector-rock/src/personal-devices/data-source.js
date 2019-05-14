import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

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
      .get();

    const currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    // if we already have a device, shortcut the function;
    if (existing.length) return currentUser;

    await this.post('/PersonalDevices', {
      PersonAliasId: currentUser.primaryAliasId,
      DeviceRegistrationId: pushId,
      PersonalDeviceTypeValueId: 671, // `mobile` device type
      NotificationsEnabled: 1,
      IsActive: 1,
    });

    return currentUser;
  }
}
