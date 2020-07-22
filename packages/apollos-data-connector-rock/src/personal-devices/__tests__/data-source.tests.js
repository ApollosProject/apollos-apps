import ApollosConfig from '@apollosproject/config';
import { AuthenticationError } from 'apollo-server';
import DataSource from '../data-source';
import { buildGetMock } from '../../test-utils';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
  ROCK_MAPPINGS: {
    MOBILE_DEVICE_TYPE_ID: 671,
  },
});

const buildDataSource = (Auth) => {
  const dataSource = new DataSource();
  dataSource.context = { dataSources: { Auth } };
  return dataSource;
};

const AuthMock = { getCurrentPerson: () => ({ primaryAliasId: 123 }) };

describe('Personal device data source', () => {
  it("must post a user's device to Rock", async () => {
    const dataSource = buildDataSource(AuthMock);
    dataSource.get = buildGetMock([], dataSource);
    dataSource.post = buildGetMock('123', dataSource);

    const result = await dataSource.addPersonalDevice({ pushId: 'somepushid' });
    expect(result).toMatchSnapshot();
    expect(dataSource.post).toMatchSnapshot();
  });
  it('must exit early if a device is found', async () => {
    const dataSource = buildDataSource(AuthMock);
    dataSource.get = buildGetMock([{ Id: 'some device' }], dataSource);
    dataSource.post = buildGetMock('123', dataSource);

    const result = await dataSource.addPersonalDevice({ pushId: 'somepushid' });
    expect(result).toMatchSnapshot();
    expect(dataSource.post).toMatchSnapshot();
  });
  it('must raise an error without a pushId', async () => {
    const dataSource = buildDataSource(AuthMock);
    dataSource.get = buildGetMock([], dataSource);
    await expect(
      dataSource.addPersonalDevice({
        pushId: null,
      })
    ).rejects.toThrow();
  });
  it('raise an error without a logged in user', async () => {
    const dataSource = buildDataSource({
      getCurrentPerson: () => throw new AuthenticationError(),
    });
    dataSource.get = buildGetMock([], dataSource);
    await expect(
      dataSource.addPersonalDevice({
        pushId: 'somepushid',
      })
    ).rejects.toThrow();
  });
  it('disable notifications', async () => {
    const dataSource = buildDataSource(AuthMock);
    dataSource.get = buildGetMock([{ id: 123 }], dataSource);
    dataSource.patch = buildGetMock('123', dataSource);

    const result = await dataSource.updateNotificationsEnabled(
      'somepushid',
      false
    );
    expect(result).toMatchSnapshot();
    expect(dataSource.get).toMatchSnapshot();
    expect(dataSource.patch).toMatchSnapshot();
  });
});
