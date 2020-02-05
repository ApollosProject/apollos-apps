import AuthDataSource from '../data-source';
import * as Person from '../../people';

describe('Auth', () => {
  const tokenMock = Promise.resolve('some token');

  Date.now = jest.fn(() => 1482363367071);

  const PersonDataSource = Person.dataSource;
  class AuthWithContext extends AuthDataSource {
    context = {
      rockCookie: 'some cookie',
      dataSources: {
        Person: new PersonDataSource(),
      },
    };
  }
  let Auth;
  beforeEach(() => {
    Auth = new AuthWithContext();
  });

  it('should get a person token', async () => {
    Auth.get = jest.fn(() => tokenMock);
    const result = await Auth.getAuthToken();
    expect(result).toMatchSnapshot();
    expect(Auth.get.mock.calls).toMatchSnapshot();
  });

  it('should post when creating a new user', async () => {
    Auth.post = jest.fn(() => Promise.resolve());
    const result = await Auth.createUserProfile({
      email: 'bob-jones@example.com',
    });
    expect(result).toMatchSnapshot();
    expect(Auth.post.mock.calls).toMatchSnapshot();
  });

  it('should post with userProfile fields when creating a new user', async () => {
    Auth.post = jest.fn(() => Promise.resolve());
    Auth.createUserLogin = jest.fn(() => Promise.resolve());
    Auth.personExists = jest.fn(() => Promise.resolve(false));
    Auth.authenticate = jest.fn(() => Promise.resolve('some-cookie'));

    const result = await Auth.registerPerson({
      email: 'bob-jones@example.com',
      userProfile: [
        { field: 'FirstName', value: 'Burke ' },
        { field: 'LastName', value: 'Shartsis ' },
      ],
    });
    expect(result).toMatchSnapshot();
    expect(Auth.post.mock.calls).toMatchSnapshot();
  });

  it('should post with userProfile fields when creating a new user and map gender/birthdate', async () => {
    Auth.post = jest.fn(() => Promise.resolve());
    Auth.createUserLogin = jest.fn(() => Promise.resolve());
    Auth.personExists = jest.fn(() => Promise.resolve(false));
    Auth.authenticate = jest.fn(() => Promise.resolve('some-cookie'));

    const result = await Auth.registerPerson({
      email: 'bob-jones@example.com',
      userProfile: [
        { field: 'FirstName', value: 'Burke ' },
        { field: 'LastName', value: 'Shartsis ' },
        { field: 'Gender', value: 'Female' },
        { field: 'BirthDate', value: '1996-02-22T05:00:00.000Z' },
      ],
    });
    expect(result).toMatchSnapshot();
    expect(Auth.post.mock.calls).toMatchSnapshot();
  });

  it('should throw an error when creating an invalid user', async () => {
    Auth.post = jest.fn(() => {
      throw new Error('HTTP error');
    });
    const result = Auth.createUserProfile({
      email: 'bob-jones@example.com',
    });
    expect(result).rejects.toMatchSnapshot();
    expect(Auth.post.mock.calls).toMatchSnapshot();
  });
});
