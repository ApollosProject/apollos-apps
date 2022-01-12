/* eslint-disable import/named */
import { getSequelize } from '../../postgres/index';
import PersonDataSource from '../../people/dataSource';
import NotificationPreferencesDataSource from '../dataSource';
import * as NotificationPreferences from '../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';
import {
  Person,
  ContentItem,
  Media,
  Follow,
  ContentItemCategory,
  Campus,
} from '../../index';

let person1;

const context = {
  church: { slug: 'apollos_demo' },
};

describe('Apollos Postgres Notification Preferences DataSource', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    await setupPostgresTestEnv(
      [
        ContentItem,
        Person,
        Campus,
        Media,
        ContentItemCategory,
        Follow,
        NotificationPreferences,
      ],
      { church: { slug: 'apollos_demo' } }
    );

    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });
  });

  afterEach(async () => {
    await sequelize.drop({ cascade: true });
    await globalSequelize.drop({ cascade: true });
  });

  it('should create a new notification preference', async () => {
    const notificationPreferencesDataSource =
      new NotificationPreferencesDataSource();
    notificationPreferencesDataSource.initialize({ context });

    const preference =
      await notificationPreferencesDataSource.updateNotificationPreference({
        personId: person1.id,
        notificationProviderId: '123-123-123',
        notificationProviderType: 'onesignal',
      });

    const { createdAt, updatedAt, id, personId, ...preferenceParts } =
      preference.dataValues;

    expect(preferenceParts).toMatchSnapshot();
    expect(personId).toBe(person1.id);
  });

  it('should update an existing notification preference', async () => {
    const notificationPreferencesDataSource =
      new NotificationPreferencesDataSource();
    notificationPreferencesDataSource.initialize({ context });

    const { id } =
      await notificationPreferencesDataSource.updateNotificationPreference({
        personId: person1.id,
        notificationProviderId: '123-123-123',
        notificationProviderType: 'onesignal',
      });

    const { id: newId, enabled } =
      await notificationPreferencesDataSource.updateNotificationPreference({
        personId: person1.id,
        notificationProviderId: '123-123-123',
        notificationProviderType: 'onesignal',
        enabled: false,
      });

    expect(newId).toEqual(id);
    expect(enabled).toBe(false);
  });

  it('should default to the current person', async () => {
    const notificationPreferencesDataSource =
      new NotificationPreferencesDataSource();
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
