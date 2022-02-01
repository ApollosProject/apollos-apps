const callback = jest.fn(() => ({
  access_token: 'access-token-123',
  refresh_token: 'refresh-token-123',
  // This is a real ID token.
  // Has an origin ID of 81
  id_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IllOREVHRkpRVUxZUFktR1hFVFpETkJSWlVLR1BZQVBBOVZES1c3VFMifQ.eyJzdWIiOiJkNTMzMDlhYS00Mzg2LTRmNzYtODkxZi1jMjBlODU4NzI0NjkiLCJhZGRyZXNzIjoiIiwiZW1haWwiOiJoaUBjb252YW4ubWUiLCJuYW1lIjoiQ29ucmFkIFZhbkxhbmRpbmdoYW0iLCJmYW1pbHlfbmFtZSI6IlZhbkxhbmRpbmdoYW0iLCJnaXZlbl9uYW1lIjoiQ29ucmFkIiwibWlkZGxlX25hbWUiOiIiLCJuaWNrbmFtZSI6IkNvbnJhZCIsInByZWZlcnJlZF91c2VybmFtZSI6IkNvbnJhZCBWYW5MYW5kaW5naGFtIiwicGljdHVyZSI6IiIsImdlbmRlciI6Ik1hbGUiLCJvZmZsaW5lX2FjY2VzcyI6IiIsInJvY2tfaWQiOiI4MSIsInJvY2tfY2FtcHVzX2lkIjoiIiwidG9rZW5fdXNhZ2UiOiJpZF90b2tlbiIsImp0aSI6IjI4ZTNlNDRmLTk1ZjctNDkwZS1iYmM5LTVhMGU3NmY1NTY1MiIsImNmZF9sdmwiOiJwcml2YXRlIiwiYXVkIjoiMjQ2MWY5YmEtZTg0YS00MTUzLTgwMzQtYjI2YjcxNTRjYmZlIiwiYXRfaGFzaCI6IjNTakhuYllrbWRNYU5HZmRNcGdqQWciLCJhenAiOiIyNDYxZjliYS1lODRhLTQxNTMtODAzNC1iMjZiNzE1NGNiZmUiLCJpYXQiOjE2NDI2NTMyMzMsImlzcyI6Imh0dHBzOi8vcm9jay5hcG9sbG9zLmFwcC8iLCJleHAiOjE2NDI2NTQ0MzMsIm5iZiI6MTY0MjY1MzIzM30.kcuyPDc_tCUoFRL38UTz4NihmuGvIebLXICewXJt_xp7YbDU9xBpZUodOg-0hY8Nmxo7SAZ8RUN20ph-EeYIvKqEyoH-uFfdrtF9oXfv6pdOqwQawpwX4pjLW0C7h0HHFb_NlhcH7hlLjyyroOMBdaSUtW1Qjc_UXEjMPXG6bcOLReN-IMeHqE6BEINYdnAqL_Y8MpoTMPTkUK-44naM02c-dIYxUzDBwpT9rZHG8lOl4hk_XL4Z1Xo152mWPFQnPCeKZo-k1UJjT8udtqf7ZBfkvLl24KLfXmqOypZWx_Gw-fSdovE-oRULJsRnw54vlZNnqM8pLNanu1fAedyJOw',
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
