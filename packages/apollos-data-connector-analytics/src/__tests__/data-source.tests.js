import { mockUA, mockSend, mockEvent } from 'universal-analytics';
import Analytics, { mockTrack, mockIdentify } from 'analytics-node';
import { AuthenticationError } from 'apollo-server';
import { dataSource as ConfigDataSource } from '@apollosproject/config';

import DataSource from '../data-source';
import RockAnalytics from '../interfaces/rock_interactions';

const mockCurrentPerson = jest.fn().mockImplementation(() => ({
  id: 5,
  email: 'test@test.com',
  firstName: 'Rick',
  lastName: 'Hampton',
}));

const mockNoPerson = () => {
  throw new AuthenticationError();
};
const mockOtherError = () => {
  throw new Error('Some other error');
};

const clearMocks = () => {
  [mockUA, mockSend, mockEvent, Analytics, mockTrack, mockIdentify].forEach(
    (mock) => {
      mock.mockClear();
    }
  );
};

const AuthWithUser = {
  getCurrentPerson: mockCurrentPerson,
};

const AuthWithoutUser = {
  getCurrentPerson: mockNoPerson,
};

const defaults = {
  ANALYTICS: { SEGMENT_KEY: 'something', GA_ID: 'something-else' },
};

const buildDataSourceAndConfig = (
  Person = AuthWithUser,
  configDefaults = defaults
) => {
  const Config = new ConfigDataSource();
  Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
  Config.loadJs(configDefaults);
  const dataSource = new DataSource();
  dataSource.initialize({
    context: { dataSources: { Person, Config } },
  });
  return dataSource;
};

describe('Analytics Data Source', () => {
  beforeEach(() => {
    clearMocks();
  });

  it('must accept arbitrary interfaces', async () => {
    const track = jest.fn();
    const identify = jest.fn();
    const fakeClient = {
      track,
      identify,
      shouldTrack: true,
      shouldIdentify: true,
      eventWhitelist: null,
      initialize: () => ({}),
    };
    const dataSource = new DataSource([fakeClient]);
    dataSource.initialize({
      context: { dataSources: { Person: AuthWithUser } },
    });

    const resultTrack = await dataSource.track({
      anonymousId: 'deviceId5',
      eventName: 'View Content',
    });

    const resultIdentify = await dataSource.identify({
      anonymousId: 'deviceId5',
    });

    expect(resultTrack).toMatchSnapshot();
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toMatchSnapshot();

    expect(resultIdentify).toMatchSnapshot();
    expect(identify).toHaveBeenCalledTimes(1);
    expect(identify).toMatchSnapshot();
  });

  describe('track', () => {
    it('must track specific events using the Rock adapter', async () => {
      const rockAnalytics = new RockAnalytics();
      const dataSource = new DataSource([rockAnalytics]);
      const mockCreateInteraction = jest.fn();
      dataSource.initialize({
        context: {
          sessionId: 'Session:123',
          dataSources: {
            Person: AuthWithUser,
            Interactions: {
              createContentItemInteraction: mockCreateInteraction,
            },
          },
        },
      });

      const result = await dataSource.track({
        eventName: 'View Content',
        properties: [
          { field: 'itemId', value: 'Content:123' },
          { field: 'title', value: 'Super Cool Content' },
        ],
      });

      expect(result).toMatchSnapshot();
      expect(mockCreateInteraction).toHaveBeenCalledTimes(1);
      expect(mockCreateInteraction.mock.calls).toMatchSnapshot();
    });
    it('must not track events using the Rock adapter without required attrs', async () => {
      const rockAnalytics = new RockAnalytics();
      const dataSource = new DataSource([rockAnalytics]);
      const mockCreateInteraction = jest.fn();
      dataSource.initialize({
        context: {
          dataSources: {
            Person: AuthWithUser,
            Interactions: {
              createInteraction: mockCreateInteraction,
            },
          },
        },
      });

      // Without session id.
      await dataSource.track({
        eventName: 'View Content',
        properties: [{ field: 'SessionId', value: 'Session:123' }],
      });

      expect(mockCreateInteraction).toHaveBeenCalledTimes(0);

      // Without content id.
      await dataSource.track({
        eventName: 'View Content',
        properties: [{ field: 'ContentId', value: 'Content:123' }],
      });

      expect(mockCreateInteraction).toHaveBeenCalledTimes(0);

      // without a current user
      dataSource.context.dataSources.Person = AuthWithoutUser;
      await dataSource.track({
        eventName: 'View Content',
        properties: [
          { field: 'ContentId', value: 'Content:123' },
          { field: 'SessionId', value: 'Session:123' },
        ],
      });

      expect(mockCreateInteraction).toHaveBeenCalledTimes(0);
      dataSource.context.dataSources.Person = AuthWithUser;

      // With an unhandled event
      rockAnalytics.eventWhitelist = ['Some Event'];

      await dataSource.track({
        eventName: 'Some Event',
        properties: [
          { field: 'ContentId', value: 'Content:123' },
          { field: 'SessionId', value: 'Session:123' },
        ],
      });

      expect(mockCreateInteraction).toHaveBeenCalledTimes(0);
    });
    it('must track an event with a name and no properties', async () => {
      const analytics = buildDataSourceAndConfig();
      const result = await analytics.track({
        eventName: 'View Content',
        anonymousId: 'deviceId5',
      });
      expect(result).toMatchSnapshot();
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack.mock.calls).toMatchSnapshot();

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockUA).toHaveBeenCalledTimes(1);
      expect(mockUA.mock.calls).toMatchSnapshot();
    });

    it('must not track segment without a key', async () => {
      const configDefaults = {
        ANALYTICS: { GA_ID: 'something-else', SEGMENT_KEY: null },
      };
      const analytics = buildDataSourceAndConfig(AuthWithUser, configDefaults);

      const result = await analytics.track({
        eventName: 'View Content',
      });
      expect(result).toMatchSnapshot();
      expect(mockTrack).toHaveBeenCalledTimes(0);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockUA).toHaveBeenCalledTimes(1);
      expect(mockUA.mock.calls).toMatchSnapshot();
    });

    it('must not track google analytics without a key', async () => {
      const configDefaults = {
        ANALYTICS: { SEGMENT_KEY: 'something', GA_ID: null },
      };
      const analytics = buildDataSourceAndConfig(AuthWithUser, configDefaults);

      const result = await analytics.track({
        eventName: 'View Content',
      });
      expect(result).toMatchSnapshot();
      expect(mockTrack).toHaveBeenCalledTimes(1);

      expect(mockSend).toHaveBeenCalledTimes(0);
      expect(mockUA).toHaveBeenCalledTimes(0);
    });

    it('must track an event with a name and properties', async () => {
      const analytics = buildDataSourceAndConfig();
      const result = await analytics.track({
        eventName: 'View Content',
        anonymousId: 'deviceId5',
        properties: [{ field: 'ContentId', value: 7 }],
      });
      expect(result).toMatchSnapshot();
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack.mock.calls).toMatchSnapshot();

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockUA).toHaveBeenCalledTimes(1);
      expect(mockUA.mock.calls).toMatchSnapshot();
    });

    it('must track without a user', async () => {
      const analytics = buildDataSourceAndConfig(AuthWithoutUser);
      const result = await analytics.track({
        eventName: 'View Content',
      });
      expect(result).toMatchSnapshot();
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack.mock.calls).toMatchSnapshot();

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockUA).toHaveBeenCalledTimes(1);
      expect(mockUA.mock.calls).toMatchSnapshot();
    });

    it('must reraise a non-auth Error', () => {
      const analytics = buildDataSourceAndConfig({
        getCurrentPerson: mockOtherError,
      });
      const result = analytics.track({
        eventName: 'View Content',
      });
      expect(result).rejects.toThrow();

      expect(mockSend).toHaveBeenCalledTimes(0);
      expect(mockTrack).toHaveBeenCalledTimes(0);
    });

    describe('identify', () => {
      it('must identify a user without traits', async () => {
        const analytics = buildDataSourceAndConfig();
        const result = await analytics.identify({
          anonymousId: 'deviceId5',
        });
        expect(result).toMatchSnapshot();
        expect(mockIdentify).toHaveBeenCalledTimes(1);
        expect(mockIdentify.mock.calls).toMatchSnapshot();

        expect(mockUA).toHaveBeenCalledTimes(0);
      });
      it('must identify a user with traits', async () => {
        const analytics = buildDataSourceAndConfig();
        const result = await analytics.identify({
          anonymousId: 'deviceId5',
          traits: [{ field: 'ChurchRole', value: 'Pastor' }],
        });
        expect(result).toMatchSnapshot();
        expect(mockIdentify).toHaveBeenCalledTimes(1);
        expect(mockIdentify.mock.calls).toMatchSnapshot();

        expect(mockUA).toHaveBeenCalledTimes(0);
      });
      it('must identify a user with device info', async () => {
        const analytics = buildDataSourceAndConfig();
        const result = await analytics.identify({
          anonymousId: 'deviceId5',
          deviceInfo: {
            platform: 'iOS',
            deviceId: 'gibberish',
            deviceMode: 'Latest iPhone',
            appVersion: '72.0.1',
          },
        });
        expect(result).toMatchSnapshot();
        expect(mockIdentify).toHaveBeenCalledTimes(1);
        expect(mockIdentify.mock.calls).toMatchSnapshot();

        expect(mockUA).toHaveBeenCalledTimes(0);
      });
    });
  });
});
