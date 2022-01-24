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

    // Get the Rock instance's personal device type value id
    let personalDeviceTypeDefinedValue = await this.request('DefinedValues')
      .filter(`Description eq 'Personal Device Type Apollos App'`)
      .first();

    // If our server hasn't created the defined value yet, do so.
    if (!personalDeviceTypeDefinedValue) {
      personalDeviceTypeDefinedValue = await this.createApollosDeviceType();
    }

    const existing = await this.request()
      .filter(
        `DeviceRegistrationId eq '${pushId}' and PersonalDeviceTypeValueId eq ${personalDeviceTypeDefinedValue?.id}`
      )
      .first();

    // if we already have a device, shortcut the function;
    const currentUser = await this.context.dataSources.Person.getCurrentPerson();

    if (existing) return currentUser;

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
      originId,
    } = await this.context.dataSources.Person.getCurrentPerson();

    const { primaryAliasId } = await this.request('People')
      .filter(`Id eq ${originId}`)
      .first();

    const device = await this.request()
      .filter(`PersonAliasId eq ${primaryAliasId}`)
      .andFilter(`DeviceRegistrationId eq '${pushId}'`)
      .first();
    if (!device) throw new Error(`Device doesn't exist`);

    return this.patch(`/PersonalDevices/${device.id}`, {
      NotificationsEnabled: enabled,
    });
  };
}
