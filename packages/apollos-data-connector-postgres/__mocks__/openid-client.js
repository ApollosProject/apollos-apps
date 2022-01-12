const callback = jest.fn(() => ({
  access_token: 'access-token-123',
  refresh_token: 'refresh-token-123',
  id_token: 'id-token-123',
}));

const userinfo = jest.fn(async () => ({
  name: 'Vincent Wilson',
  email: 'vincent@differential.com',
}));

const refresh = jest.fn(() => ({
  access_token: 'access-token-8910',
  id_token: 'id-token-8910',
}));

class Client {
  callback = callback;

  redirect_uris = ['http://rock.apollos.app/123'];

  userinfo = userinfo;

  refresh = refresh;
}

const Issuer = {
  discover: jest.fn(async () => ({
    Client,
  })),
};

export { Issuer, callback, userinfo, refresh };
