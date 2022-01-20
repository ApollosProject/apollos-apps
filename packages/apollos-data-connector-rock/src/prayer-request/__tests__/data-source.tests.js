import { advanceTo } from 'jest-date-mock';
import { dataSource as ConfigDataSource } from '@apollosproject/config';
import Prayer from '../data-source';
import { buildGetMock } from '../../test-utils';

const auth = (dataSource, other = {}) => ({
  getCurrentPerson: buildGetMock(
    {
      Id: 51,
      FirstName: 'Vincent',
      LastName: 'Wilson',
      PrimaryAliasId: 51,
      Email: 'Email@Email.com',
      ...other,
    },
    dataSource
  ),
});

const prayersMock = [
  {
    FirstName: 'Conrad',
    LastName: 'VanLandingham',
    Email: 'hi@convan.me',
    RequestedByPersonAliasId: null,
    CategoryId: 2,
    Text:
      'Our Father, Who art in heaven, \nHallowed be Thy Name. \nThy Kingdom come. \nThy Will be done, \non earth as it is in Heaven.\n\nGive us this day our daily bread. \nAnd forgive us our trespasses, \nas we forgive those who trespass against us. \nAnd lead us not into temptation, \nbut deliver us from evil. Amen.',
    Answer: '',
    EnteredDateTime: '2020-05-15T12:42:29.227',
    ExpirationDate: '2020-05-29T00:00:00',
    GroupId: null,
    AllowComments: true,
    IsUrgent: false,
    IsPublic: true,
    IsActive: true,
    IsApproved: true,
    FlagCount: null,
    PrayerCount: null,
    ApprovedByPersonAliasId: 62,
    CampusId: 2,
    ApprovedOnDateTime: '2020-05-15T12:42:29.227',
    RequestedByPersonAlias: 62,
    Category: null,
    ApprovedByPersonAlias: null,
    CreatedDateTime: '2020-05-15T12:42:29.243',
    ModifiedDateTime: '2020-05-15T12:42:29.243',
    CreatedByPersonAliasId: 62,
    ModifiedByPersonAliasId: 62,
    ModifiedAuditValuesAlreadyUpdated: false,
    Attributes: null,
    AttributeValues: null,
    Id: 13,
    Guid: 'eb90493d-0e41-4a35-b085-3b48ac78cadf',
    ForeignId: null,
    ForeignGuid: null,
    ForeignKey: null,
  },
  {
    FirstName: 'Michael',
    LastName: 'Neeley',
    Email: 'michaels@email.com',
    RequestedByPersonAliasId: null,
    CategoryId: 2,
    Text: 'Another prayer',
    Answer: '',
    EnteredDateTime: '2020-05-15T12:42:29.227',
    ExpirationDate: '2020-05-29T00:00:00',
    GroupId: null,
    AllowComments: true,
    IsUrgent: false,
    IsPublic: true,
    IsActive: true,
    IsApproved: true,
    FlagCount: null,
    PrayerCount: null,
    ApprovedByPersonAliasId: 63,
    CampusId: 2,
    ApprovedOnDateTime: '2020-05-15T12:42:29.227',
    RequestedByPersonAlias: null,
    Category: null,
    ApprovedByPersonAlias: null,
    CreatedDateTime: '2020-05-15T12:42:29.243',
    ModifiedDateTime: '2020-05-15T12:42:29.243',
    CreatedByPersonAliasId: 63,
    ModifiedByPersonAliasId: 63,
    ModifiedAuditValuesAlreadyUpdated: false,
    Attributes: null,
    AttributeValues: null,
    Id: 13,
    Guid: 'eb90493d-0e41-4a35-b085-3b48ac78cadf',
    ForeignId: null,
    ForeignGuid: null,
    ForeignKey: null,
  },
];

const Person = {
  getFromId: () => ({
    id: 1,
  }),
};

describe('Prayer', () => {
  it('constructs', () => {
    expect(new Prayer()).toBeTruthy();
  });

  it('gets daily prayer feed', async () => {
    advanceTo(new Date(2020, 1, 20, 0, 0, 0));
    const dataSource = new Prayer();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    const Auth = auth(dataSource);

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth, Config },
    };
    dataSource.get = buildGetMock([prayersMock[0]], dataSource);

    const result = await (
      await dataSource.byDailyPrayerFeed({
        numberDaysSincePrayer: 3,
      })
    ).get();
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets daily prayer feed by person', async () => {
    advanceTo(new Date(2020, 1, 20, 0, 0, 0));
    const dataSource = new Prayer();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    const Auth = auth(dataSource);

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth, Person, Config },
    };
    dataSource.get = buildGetMock(
      [{ PrimaryAliasId: 1 }, prayersMock[1]],
      dataSource
    );

    const result = await (
      await dataSource.byDailyPrayerFeed({
        numberDaysSincePrayer: 3,
        id: 63,
      })
    ).get();
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets by id', () => {
    const dataSource = new Prayer();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    dataSource.context = {
      dataSources: { Config },
    };
    dataSource.get = buildGetMock({ Id: 1 }, dataSource);
    const result = dataSource.getFromId(1);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('flags by id', () => {
    const dataSource = new Prayer();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    dataSource.context = {
      dataSources: { Config },
    };
    dataSource.put = buildGetMock({ Id: 1 }, dataSource);
    const result = dataSource.flag(1);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.put.mock.calls).toMatchSnapshot();
  });

  it('increment prayed by id', () => {
    const dataSource = new Prayer();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    dataSource.context = {
      dataSources: { Config, Cache: { get: () => null, set: () => null } },
    };
    dataSource.put = buildGetMock({ Id: 1 }, dataSource);
    dataSource.getFromId = () => ({ prayerCount: 0 });
    const result = dataSource.incrementPrayed(1);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.put.mock.calls).toMatchSnapshot();
  });

  describe('adding prayer', () => {
    beforeEach(() => advanceTo(new Date(2020, 1, 20, 0, 0, 0)));
    it('adds prayer', async () => {
      const dataSource = new Prayer();
      const Auth = auth(dataSource);
      const Config = new ConfigDataSource();
      Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
      dataSource.context = {
        rockCookie: 'fakeCookie',
        dataSources: { Auth, Config },
      };
      dataSource.post = buildGetMock({ Id: 15 }, dataSource);
      dataSource.get = buildGetMock({ Id: 15 }, dataSource);

      const result = await dataSource.addPrayer({ text: 'My prayer' });
      expect(result).toMatchSnapshot();
      expect(dataSource.post.mock.calls).toMatchSnapshot();
      expect(dataSource.get.mock.calls).toMatchSnapshot();
    });

    it('adds anonymous prayer', async () => {
      const dataSource = new Prayer();
      const Auth = auth(dataSource);
      const Config = new ConfigDataSource();
      Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
      dataSource.context = {
        rockCookie: 'fakeCookie',
        dataSources: { Auth, Config },
      };
      dataSource.post = buildGetMock({ Id: 15 }, dataSource);
      dataSource.get = buildGetMock({ Id: 15 }, dataSource);

      const result = await dataSource.addPrayer({
        text: 'My prayer',
        isAnonymous: true,
      });
      expect(result).toMatchSnapshot();
      expect(dataSource.post.mock.calls).toMatchSnapshot();
      expect(dataSource.get.mock.calls).toMatchSnapshot();
    });

    it('uses nickname', async () => {
      const dataSource = new Prayer();
      const Auth = auth(dataSource, { NickName: 'Vinny' });
      const Config = new ConfigDataSource();
      Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
      dataSource.context = {
        rockCookie: 'fakeCookie',
        dataSources: { Auth, Config },
      };
      dataSource.post = buildGetMock({ Id: 15 }, dataSource);
      dataSource.get = buildGetMock({ Id: 15 }, dataSource);

      const result = await dataSource.addPrayer({
        text: 'My prayer',
        isAnonymous: true,
      });
      expect(result).toMatchSnapshot();
      expect(dataSource.post.mock.calls).toMatchSnapshot();
      expect(dataSource.get.mock.calls).toMatchSnapshot();
    });

    it('uses user campus', async () => {
      const dataSource = new Prayer();
      const Auth = auth(dataSource, { PrimaryCampusId: 1 });
      const Config = new ConfigDataSource();
      Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

      dataSource.context = {
        rockCookie: 'fakeCookie',
        dataSources: { Auth, Config },
      };
      dataSource.post = buildGetMock({ Id: 15 }, dataSource);
      dataSource.get = buildGetMock({ Id: 15 }, dataSource);

      const result = await dataSource.addPrayer({
        text: 'My prayer',
        isAnonymous: true,
      });
      expect(result).toMatchSnapshot();
      expect(dataSource.post.mock.calls).toMatchSnapshot();
      expect(dataSource.get.mock.calls).toMatchSnapshot();
    });
  });
});
