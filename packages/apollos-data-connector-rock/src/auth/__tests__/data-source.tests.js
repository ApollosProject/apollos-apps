import AuthDataSource from '../data-source';

describe('Auth', () => {
  const tokenMock = Promise.resolve('some token');

  class AuthWithContext extends AuthDataSource {
    context = {
      rockCookie: 'some cookie',
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
});
