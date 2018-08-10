import { AuthenticationError } from 'apollo-server';
import moment from 'moment';

import RockApolloDataSource from '/api/connectors/rock/data-source';
import { generateToken, registerToken } from './token';

export default class AuthDataSource extends RockApolloDataSource {
  resource = 'Auth';
  rockCookie = null;
  userToken = null;

  getCurrentPerson = async () => {
    const { rockCookie } = this.context;
    if (rockCookie) {
      const request = await this.request('People/GetCurrentPerson').get({
        options: { headers: { cookie: rockCookie } },
      });
      return request;
    }
    throw new AuthenticationError('Must be logged in');
  };

  fetchUserCookie = async (Username, Password) => {
    try {
      const response = await this.post('Auth/Login', {
        Username,
        Password,
      });
      if (response.status >= 400) throw new AuthenticationError();
      const cookie = response.headers.get('set-cookie');
      return cookie;
    } catch (err) {
      throw new AuthenticationError('Invalid Credentials');
    }
  };

  authenticate = async ({ identity, password }) => {
    try {
      const cookie = await this.fetchUserCookie(identity, password);
      const token = generateToken({ cookie });
      const { userToken, rockCookie } = registerToken(token);
      this.context.userToken = userToken;
      this.context.rockCookie = rockCookie;
      return { token };
    } catch (e) {
      throw e;
    }
  };

  personExists = async ({ identity }) => {
    const hasUserName = await this.request(
      `/UserLogins?$filter=UserName eq '${identity}'`
    ).get();

    if (hasUserName.length) {
      return true;
    }
    return false;
  };

  createUserProfile = async (props = {}) => {
    try {
      const { email } = props;

      const response = await this.post('/People', {
        Email: email,
        IsSystem: false, // Required by Rock
        Gender: 0, // Required by Rock
      });
      return response.json();
    } catch (err) {
      throw new Error('Unable to create profile!');
    }
  };

  createUserLogin = async (props = {}) => {
    try {
      const { email, password, personId } = props;

      const result = await this.post('/UserLogins', {
        PersonId: personId,
        EntityTypeId: 27, // A default setting we use in Rock-person-creation-flow
        UserName: email,
        PlainTextPassword: password,
        LastLoginDateTime: `${moment().toISOString()}`,
      });
      return result.json();
    } catch (err) {
      throw new Error('Unable to create user login!');
    }
  };

  registerPerson = async ({ email, password }) => {
    const personExists = await this.personExists({ identity: email });
    if (personExists) throw new Error('User already exists!');

    const { personId } = await this.createUserProfile({ email });

    await this.createUserLogin({
      email,
      password,
      personId,
    });

    const token = await this.authenticate({ identity: email, password });
    return token;
  };
}
