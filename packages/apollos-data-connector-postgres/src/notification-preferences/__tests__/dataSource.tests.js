import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
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

    const preference = await notificationPreferencesDataSource.updateNotificationPreferences(
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
    } = await notificationPreferencesDataSource.updateNotificationPreferences({
      personId: person1.id,
      notificationProviderId: '123-123-123',
      notificationProviderType: 'onesignal',
    });

    const {
      id: newId,
      enabled,
    } = await notificationPreferencesDataSource.updateNotificationPreferences({
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
    context.dataSources = { Person: { getCurrentPersonId: () => person1.id } };
    notificationPreferencesDataSource.initialize({ context });

    const {
      personId,
    } = await notificationPreferencesDataSource.updateNotificationPreferences({
      notificationProviderId: '123-123-123',
      notificationProviderType: 'onesignal',
    });

    expect(personId).toEqual(person1.id);
  });
});
