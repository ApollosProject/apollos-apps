import { dataSource as ConfigDataSource } from '@apollosproject/config';
import Person from '../data-source';
import { buildGetMock } from '../../test-utils';

const auth = (dataSource) => ({
  getCurrentPerson: buildGetMock(
    { id: 51, FirstName: 'Vincent', LastName: 'Wilson', originId: 51 },
    dataSource
  ),
});

describe('Person', () => {
  it('constructs', () => {
    expect(new Person()).toBeTruthy();
  });

  it('gets person from id', () => {
    const dataSource = new Person();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    dataSource.context = { dataSources: { Config } };

    dataSource.get = buildGetMock([{ Id: 51 }], dataSource);
    const result = dataSource.getFromId(51);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('creates a profile', () => {
    const dataSource = new Person();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    dataSource.context = { dataSources: { Config } };

    dataSource.post = buildGetMock({}, dataSource);
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.create({
      FirstName: 'Vincent',
      Gender: 'Male',
      BirthDate: new Date(2020, 1, 1, 0, 0, 0, 0),
    });
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.post.mock.calls).toMatchSnapshot();
  });

  it("updates a user's profile attributes", () => {
    const dataSource = new Person();
    // Postgres Person
    const PGPerson = auth(dataSource);
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Config, Person: PGPerson },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.updateProfile([
      {
        field: '        FirstName',
        value: 'Nick',
      },
    ]);
    expect(result).resolves.toMatchSnapshot();
    expect(PGPerson.getCurrentPerson.mock.calls).toMatchSnapshot();
    expect(dataSource.patch.mock.calls).toMatchSnapshot();
  });

  it("updates a user's gender attributes", () => {
    const dataSource = new Person();
    // Postgres Person
    const PGPerson = auth(dataSource);
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Config, Person: PGPerson },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.updateProfile([
      {
        field: 'Gender',
        value: 'Male',
      },
    ]);
    expect(result).resolves.toMatchSnapshot('result');
    expect(PGPerson.getCurrentPerson.mock.calls).toMatchSnapshot(
      'current person'
    );
    expect(dataSource.patch.mock.calls).toMatchSnapshot('rock patch');
  });

  it("updates a user's birth date attributes", async () => {
    const dataSource = new Person();
    const PGPerson = auth(dataSource);
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Person: PGPerson, Config },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = await dataSource.updateProfile([
      {
        field: 'BirthDate',
        value: '1996-11-02T07:00:00.000Z',
      },
    ]);
    expect(result).toMatchSnapshot();
    expect(PGPerson.getCurrentPerson.mock.calls).toMatchSnapshot();
    expect(dataSource.patch.mock.calls).toMatchSnapshot();
  });

  it('throws an error setting an invalid birth date', () => {
    expect.assertions(1);
    const dataSource = new Person();
    const PGPerson = auth(dataSource);
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Person: PGPerson, Config },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.updateProfile([
      {
        field: 'BirthDate',
        value: 'ABCD',
      },
    ]);
    expect(result).rejects.toThrowErrorMatchingSnapshot();
  });

  it('Throws an error if trying to set an invalid gender', () => {
    expect.assertions(1);
    const dataSource = new Person();
    const PGPerson = auth(dataSource);
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Person: PGPerson, Config },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.updateProfile([
      {
        field: 'Gender',
        value: 'Squirrel',
      },
    ]);
    expect(result).rejects.toThrowErrorMatchingSnapshot();
  });

  it("uploads a user's profile picture", async () => {
    const dataSource = new Person();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

    const uploadMock = jest.fn(() => Promise.resolve('456'));
    const binaryGetMock = jest.fn(() =>
      Promise.resolve({ id: 123, url: 'http://imageurl.....' })
    );
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: {
        Person: { getCurrentPerson: () => Promise.resolve({ id: 123 }) },
        BinaryFiles: { uploadFile: uploadMock, getFromId: binaryGetMock },
        Config,
      },
    };
    dataSource.updateProfile = buildGetMock(
      { Id: 51, FirstName: 'Vincent', LastName: 'Wilson' },
      dataSource
    );
    dataSource.get = buildGetMock([], dataSource);

    const result = await dataSource.uploadProfileImage(
      { createReadStream: () => '123', filename: 'img.jpg' },
      456
    );
    expect(result).toMatchSnapshot('Upload result');
    expect(uploadMock.mock.calls).toMatchSnapshot('Upload datasource mock');
    expect(binaryGetMock.mock.calls).toMatchSnapshot(
      'Get media datasource mock'
    );
    expect(dataSource.updateProfile.mock.calls).toMatchSnapshot(
      'Update profile mock'
    );
    expect(dataSource.get.mock.calls).toMatchSnapshot(
      'Get updated profile mock'
    );
  });
});
