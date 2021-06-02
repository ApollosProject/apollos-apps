import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import PersonDataSource from '../../people/dataSource';
import NotificationPreferencesDataSource from '../dataSource';

let person1;

const context = {};

describe('Apollos Postgres Notification Preferences DataSource', () => {
  beforeEach(async () => {
    await createPeopleModel();
    await createModel();
    await setupModel();
    await sync();

    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });
  });

  afterEach(async () => {
    await sequelize.drop({});
  });

  it('should create a new notification preference', async () => {
    const notificationPreferencesDataSource = new NotificationPreferencesDataSource();
    notificationPreferencesDataSource.initialize({ context });

    const preference = await notificationPreferencesDataSource.updateNotificationPreference(
      {
        personId: person1.id,
        notificationProviderId: '123-123-123',
        notificationProviderType: 'onesignal',
      }
    );

    const {
      createdAt,
      updatedAt,
      id,
      personId,
      ...preferenceParts
    } = preference.dataValues;

    expect(preferenceParts).toMatchSnapshot();
    expect(personId).toBe(person1.id);
  });

  it('should update an existing notification preference', async () => {
    const notificationPreferencesDataSource = new NotificationPreferencesDataSource();
    notificationPreferencesDataSource.initialize({ context });

    const {
      id,
    } = await notificationPreferencesDataSource.updateNotificationPreference({
      personId: person1.id,
      notificationProviderId: '123-123-123',
      notificationProviderType: 'onesignal',
    });

    const {
      id: newId,
      enabled,
    } = await notificationPreferencesDataSource.updateNotificationPreference({
      personId: person1.id,
      notificationProviderId: '123-123-123',
      notificationProviderType: 'onesignal',
      enabled: false,
    });

    expect(newId).toEqual(id);
    expect(enabled).toBe(false);
  });

  it('should default to the current person', async () => {
    const notificationPreferencesDataSource = new NotificationPreferencesDataSource();
    const personDataSource = new PersonDataSource();
    notificationPreferencesDataSource.initialize({ context });
    personDataSource.initialize({ context });

    context.dataSources = { Person: personDataSource };
    context.dataSources.Person.getCurrentPersonId = () => person1.id;
    // context.dataSources = { Person: { getCurrentPersonId: , model: sequelize.models.people } };

    await notificationPreferencesDataSource.updateUserNotificationPreference({
      notificationProviderId: '123-123-123',
      notificationProviderType: 'onesignal',
    });

    const preferences = await notificationPreferencesDataSource.model.findAll({
      where: { personId: person1.id },
    });

    expect(preferences.length).toEqual(1);
  });
});
