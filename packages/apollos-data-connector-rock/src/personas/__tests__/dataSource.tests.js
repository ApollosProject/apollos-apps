import ApollosConfig from '@apollosproject/config';
import { buildGetMock } from '../../test-utils';
import { dataSource as Persona } from '../index';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

const personaAuth = (dataSource) => ({
  getCurrentPerson: buildGetMock(
    { id: 51, FirstName: 'Vincent', LastName: 'Wilson' },
    dataSource
  ),
});

const rockConstants = () => ({
  modelType: (type) => ({ id: 15, type }),
});

describe('Person dataSource', () => {
  it('gets persons dataview associations', async () => {
    const dataSource = new Persona();
    const Auth = personaAuth(dataSource);

    const RockConstants = rockConstants();
    const categoryId = 210;

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth, RockConstants },
    };
    dataSource.get = buildGetMock({}, dataSource);

    const result = await dataSource.getPersonas(categoryId);
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets persons dataview associations from plugin endpoints', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: true,
      },
    });
    const dataSource = new Persona();
    const Auth = personaAuth(dataSource);

    const RockConstants = rockConstants();
    const categoryId = 210;

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth, RockConstants },
    };
    dataSource.get = buildGetMock({}, dataSource);

    const result = await dataSource.getPersonas({ categoryId });
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();

    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: false,
      },
    });
  });
});
