import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class PersonalDevices extends RockApolloDataSource {
  resource = 'PersonalDevices';

  async createApollosDeviceType() {
    const mobileType = await this.request('DefinedTypes')
      .filter(`Name eq 'Personal Device Type'`)
      .first();

    await this.post('/DefinedValues', {
      Description: 'Personal Device Type Apollos App',
      Value: 'Mobile (Apollos)',
      DefinedTypeId: mobileType.id,
      IsSystem: false,
      Order: 0,
      IsActive: true,
    });

    return this.request('DefinedValues')
      .filter(`Description eq 'Personal Device Type Apollos App'`)
      .first();
  }

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

    // Get the Rock instance's apollos device type value id
    let personalDeviceTypeDefinedValue = await this.request('DefinedValues')
      .filter(`Description eq 'Personal Device Type Apollos App'`)
      .first();

    console.log(personalDeviceTypeDefinedValue);

    // If our server hasn't created the defined value yet, do so.
    if (!personalDeviceTypeDefinedValue) {
      personalDeviceTypeDefinedValue = await this.createApollosDeviceType();
    }

    await this.post('/PersonalDevices', {
      PersonAliasId: currentUser.primaryAliasId,
      DeviceRegistrationId: pushId,
      PersonalDeviceTypeValueId: personalDeviceTypeDefinedValue?.id,
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
