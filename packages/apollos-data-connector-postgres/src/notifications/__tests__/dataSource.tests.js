/* eslint-disable import/named */
import { getSequelize } from '../../postgres/index';
import NotificationPreferenceDataSource from '../../notification-preferences/dataSource';
import NotificationsDataSource from '../dataSource';
import * as Notifications from '../index';
import {
  Person,
  ContentItem,
  Media,
  ContentItemCategory,
  NotificationPreference,
  Campus,
} from '../../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

let person1;

const context = {
  church: { slug: 'apollos_demo' },
};

describe('Apollos Postgres Notifications DataSource', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    await setupPostgresTestEnv(
      [
        Person,
        Campus,
        NotificationPreference,
        Notifications,
        ContentItemCategory,
        Media,
        ContentItem,
      ],
      { church: { slug: 'apollos_demo' } }
    );

    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });

    await sequelize.models.notificationPreferences.create({
      personId: person1.id,
      notificationProviderId: '111-bbb-ccc',
      notificationProviderType: 'one_signal',
      enabled: true,
    });

    const notificationPreferenceDataSource =
      new NotificationPreferenceDataSource();
    notificationPreferenceDataSource.initialize({ context });
    context.dataSources = {
      NotificationPreference: notificationPreferenceDataSource,
    };
  });

  afterEach(async () => {
    await sequelize.drop({ cascade: true });
    await globalSequelize.drop({ cascade: true });
  });

  it('should create and send notification', async () => {
    const notificationDataSource = new NotificationsDataSource();
    notificationDataSource.initialize({ context });

    notificationDataSource.DELIVERY_METHODS.one_signal = jest.fn(async () => ({
      id: '123-123-123',
    }));

    const notification = await notificationDataSource.createAndSend({
      title: 'Some title',
      subtitle: 'Some subtitle',
      body: 'Some body',
      personId: person1.id,
      type: notificationDataSource.NOTIFICATION_TYPES.PRAYER,
    });

    expect(notification.title).toEqual('Some title');
    expect(notification.subtitle).toEqual('Some subtitle');
    expect(notification.body).toEqual('Some body');
    expect(notification.personId).toEqual(person1.id);
    expect(notification.externalNotificationId).toEqual('123-123-123');
    expect(
      notificationDataSource.DELIVERY_METHODS.one_signal.mock.calls.length
    ).toBe(1);
  });
  it('should not create a notifcation without a preference', async () => {
    const notificationDataSource = new NotificationsDataSource();
    notificationDataSource.initialize({ context });

    await sequelize.models.notificationPreferences.destroy({
      where: {
        personId: person1.id,
      },
    });

    const notification = await notificationDataSource.createAndSend({
      title: 'Some title',
      subtitle: 'Some subtitle',
      body: 'Some body',
      personId: person1.id,
      type: notificationDataSource.NOTIFICATION_TYPES.PRAYER,
    });

    expect(notification).toBe(null);
  });
  it('should not create a notifcation with a disabled preference', async () => {
    const notificationDataSource = new NotificationsDataSource();
    notificationDataSource.initialize({ context });

    await sequelize.models.notificationPreferences.update(
      { enabled: false },
      {
        where: {
          personId: person1.id,
        },
      }
    );

    const notification = await notificationDataSource.createAndSend({
      title: 'Some title',
      subtitle: 'Some subtitle',
      body: 'Some body',
      personId: person1.id,
      type: notificationDataSource.NOTIFICATION_TYPES.PRAYER,
    });

    expect(notification).toBe(null);
  });
  it('throws an error without personId', async () => {
    const notificationDataSource = new NotificationsDataSource();
    notificationDataSource.initialize({ context });

    try {
      await notificationDataSource.createAndSend({
        title: 'Some title',
        subtitle: 'Some subtitle',
        body: 'Some body',
        personId: null,
        type: notificationDataSource.NOTIFICATION_TYPES.PRAYER,
      });
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });
  it('throws an error with an invalid type', async () => {
    const notificationDataSource = new NotificationsDataSource();
    notificationDataSource.initialize({ context });

    try {
      await notificationDataSource.createAndSend({
        title: 'Some title',
        subtitle: 'Some subtitle',
        body: 'Some body',
        personId: person1.id,
        type: 'new-type',
      });
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });
  it('throws an error with an invalid delivery method', async () => {
    const notificationDataSource = new NotificationsDataSource();
    notificationDataSource.initialize({ context });

    try {
      await notificationDataSource.createAndSend({
        title: 'Some title',
        subtitle: 'Some subtitle',
        body: 'Some body',
        personId: person1.id,
        type: notificationDataSource.NOTIFICATION_TYPES.PRAYER,
        method: 'new-method',
      });
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });
});
