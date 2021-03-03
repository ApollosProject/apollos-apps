import ApollosConfig from '@apollosproject/config';
import Person from '../data-source';
import { buildGetMock } from '../../test-utils';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

const auth = (dataSource) => ({
  getCurrentPerson: buildGetMock(
    { Id: 51, FirstName: 'Vincent', LastName: 'Wilson' },
    dataSource
  ),
});

describe('Person', () => {
  it('constructs', () => {
    expect(new Person()).toBeTruthy();
  });

  it('gets person from id', () => {
    const dataSource = new Person();
    dataSource.get = buildGetMock([{ Id: 51 }], dataSource);
    const result = dataSource.getFromId(51);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets person from aliasId', async () => {
    const dataSource = new Person();
    dataSource.get = jest.fn(() => Promise.resolve([{ personId: 123 }]));
    dataSource.getFromId = jest.fn(() =>
      Promise.resolve({ id: 321, firstName: 'John' })
    );

    const result = await dataSource.getFromAliasId(51);
    expect(result).toMatchSnapshot('The result from getAliasId');
    expect(dataSource.get.mock.calls).toMatchSnapshot(
      'The call to fetch the alias id'
    );
    expect(dataSource.getFromId.mock.calls).toMatchSnapshot(
      'The call to fetch the person by id'
    );
  });

  it('returns null when getPersonByAliasId is not valid', async () => {
    const dataSource = new Person();
    dataSource.get = jest.fn(() => Promise.resolve([]));

    const result = await dataSource.getFromAliasId(51);
    expect(result).toMatchSnapshot('The result from getAliasId');
    expect(dataSource.get.mock.calls).toMatchSnapshot(
      'The call to fetch the alias id'
    );
  });

  it('creates a profile', () => {
    const dataSource = new Person();
    dataSource.post = buildGetMock({}, dataSource);
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
    const Auth = auth(dataSource);
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.updateProfile([
      {
        field: '        FirstName',
        value: 'Nick',
      },
    ]);
    expect(result).resolves.toMatchSnapshot();
    expect(Auth.getCurrentPerson.mock.calls).toMatchSnapshot();
    expect(dataSource.patch.mock.calls).toMatchSnapshot();
  });

  it("updates a user's gender attributes", () => {
    const dataSource = new Person();
    const Auth = auth(dataSource);
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = dataSource.updateProfile([
      {
        field: 'Gender',
        value: 'Male',
      },
    ]);
    expect(result).resolves.toMatchSnapshot('result');
    expect(Auth.getCurrentPerson.mock.calls).toMatchSnapshot('current person');
    expect(dataSource.patch.mock.calls).toMatchSnapshot('rock patch');
  });

  it("updates a user's birth date attributes", async () => {
    const dataSource = new Person();
    const Auth = auth(dataSource);
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth },
    };
    dataSource.patch = buildGetMock({}, dataSource);
    const result = await dataSource.updateProfile([
      {
        field: 'BirthDate',
        value: '1996-11-02T07:00:00.000Z',
      },
    ]);
    expect(result).toMatchSnapshot();
    expect(Auth.getCurrentPerson.mock.calls).toMatchSnapshot();
    expect(dataSource.patch.mock.calls).toMatchSnapshot();
  });

  it('throws an error setting an invalid birth date', () => {
    const dataSource = new Person();
    const Auth = auth(dataSource);
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth },
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
    const dataSource = new Person();
    const Auth = auth(dataSource);
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: { Auth },
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
    const uploadMock = jest.fn(() => Promise.resolve('456'));
    const binaryGetMock = jest.fn(() =>
      Promise.resolve({ id: 123, url: 'http://imageurl.....' })
    );
    dataSource.context = {
      rockCookie: 'fakeCookie',
      dataSources: {
        Auth: { getCurrentPerson: () => Promise.resolve({ id: 123 }) },
        BinaryFiles: { uploadFile: uploadMock, getFromId: binaryGetMock },
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
