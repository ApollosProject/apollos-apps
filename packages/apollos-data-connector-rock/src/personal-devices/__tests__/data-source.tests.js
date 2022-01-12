import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { AuthenticationError } from 'apollo-server';
import DataSource from '../data-source';
import { buildGetMock } from '../../test-utils';

const buildDataSource = (Person) => {
  const dataSource = new DataSource();
  const Config = new ConfigDataSource();
  Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
  dataSource.context = { dataSources: { Person, Config } };
  return dataSource;
};

const AuthMock = { getCurrentPerson: () => ({ originId: 123 }) };

describe('Personal device data source', () => {
  it("must post a user's device to Rock", async () => {
    const dataSource = buildDataSource(AuthMock);
    dataSource.get = buildGetMock(
      [[null], [{ PersonAliasId: '123' }], [{ Id: '123' }]],
      dataSource
    );
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
      getCurrentPerson: () => {
        throw new AuthenticationError();
      },
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
