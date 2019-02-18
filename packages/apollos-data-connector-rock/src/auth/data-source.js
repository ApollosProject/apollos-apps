import crypto from 'crypto';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { fetch, Request } from 'apollo-server-env';
import moment from 'moment';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

import { generateToken, registerToken, secret } from './token';

export default class AuthDataSource extends RockApolloDataSource {
  resource = 'Auth';

  rockCookie = null;

  userToken = null;

  getCurrentPerson = async ({ cookie } = { cookie: null }) => {
    const { rockCookie } = this.context;
    const userCookie = cookie || rockCookie;

    if (userCookie) {
      const request = await this.request('People/GetCurrentPerson').get({
        options: { headers: { cookie: userCookie } },
      });
      return request;
    }
    throw new AuthenticationError('Must be logged in');
  };

  fetchUserCookie = async (Username, Password) => {
    try {
      // We use `new Response` rather than string/options b/c if conforms more closely with ApolloRESTDataSource
      // (makes mocking in tests WAY easier to use `new Request` as an input in both places)
      const response = await fetch(
        new Request(`${this.baseURL}/Auth/Login`, {
          method: 'POST',
          body: JSON.stringify({
            Username,
            Password,
          }),
          headers: {
            'Content-Type': 'Application/Json',
          },
        })
      );
      if (response.status >= 400) throw new AuthenticationError();
      const cookie = response.headers.get('set-cookie');
      return cookie;
    } catch (err) {
      throw new AuthenticationError('Invalid Credentials');
    }
  };

  createSession = async ({ cookie }) => {
    const currentUser = await this.getCurrentPerson({ cookie });
    return this.post('/InteractionSessions', {
      PersonAliasId: currentUser.primaryAliasId,
    });
  };

  authenticate = async ({ identity, password }) => {
    try {
      const cookie = await this.fetchUserCookie(identity, password);
      const sessionId = await this.createSession({ cookie });
      const token = generateToken({ cookie, sessionId });
      const { userToken, rockCookie } = registerToken(token);
      this.context.rockCookie = rockCookie;
      this.context.userToken = userToken;
      this.context.sessionId = sessionId;
      return { token, rockCookie };
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

      return await this.post('/People', {
        Email: email,
        IsSystem: false, // Required by Rock
        Gender: 0, // Required by Rock
      });
    } catch (err) {
      throw new Error('Unable to create profile!');
    }
  };

  createUserLogin = async (props = {}) => {
    try {
      const { email, password, personId } = props;

      return await this.post('/UserLogins', {
        PersonId: personId,
        EntityTypeId: 27, // A default setting we use in Rock-person-creation-flow
        UserName: email,
        PlainTextPassword: password,
        LastLoginDateTime: `${moment().toISOString()}`,
      });
    } catch (err) {
      throw new Error('Unable to create user login!');
    }
  };

  changePassword = async ({ password }) => {
    const currentUser = await this.getCurrentPerson();
    const { email, id } = currentUser;
    const login = await this.request('/UserLogins')
      .filter(`UserName eq '${email}'`)
      .first();

    if (login) {
      await this.delete(`/UserLogins/${login.id}`);
    }
    await this.createUserLogin({
      personId: id,
      email,
      password,
    });
    return this.authenticate({
      identity: email,
      password,
    });
  };

  registerPerson = async ({ email, password }) => {
    const personExists = await this.personExists({ identity: email });
    if (personExists) throw new Error('User already exists!');

    const personId = await this.createUserProfile({ email });
    await this.createUserLogin({
      email,
      password,
      personId,
    });

    const token = await this.authenticate({ identity: email, password });
    return token;
  };

  hashPassword = ({ pin }) =>
    crypto
      .createHash('sha256')
      .update(`${pin}${secret}`)
      .digest('hex');

  parsePhoneNumber = ({ phoneNumber }) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const isValid = /^\+?[1-9]\d{1,14}$/.test(cleanedNumber);
    if (phoneNumber.length > 11 || phoneNumber.length < 10 || !isValid) {
      return { valid: false, formattedNumber: '', phoneNumber };
    }

    const numberWithoutCountry =
      cleanedNumber.length === 10 ? cleanedNumber : cleanedNumber.slice(1);

    const area = numberWithoutCountry.slice(0, 3);
    const firstThree = numberWithoutCountry.slice(3, 6);
    const lastFour = numberWithoutCountry.slice(6, 10);
    return {
      valid: true,
      formattedNumber: `(${area}) ${firstThree}-${lastFour}`,
      phoneNumber: numberWithoutCountry,
    };
  };

  generateSmsPinAndPassword = () => {
    const pin = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');
    const password = this.hashPassword({ pin });

    return { pin, password };
  };

  createOrFindSmsLoginUserId = async ({ phoneNumber: inputPhoneNumber }) => {
    const { phoneNumber } = this.parsePhoneNumber({
      phoneNumber: inputPhoneNumber,
    });
    const existingPhoneNumber = await this.request('/PhoneNumbers')
      .filter(`Number eq '${phoneNumber}'`)
      .first();

    if (existingPhoneNumber) {
      return existingPhoneNumber.personId;
    }

    const personId = await this.createUserProfile({ email: null });

    await this.post('/PhoneNumbers', {
      PersonId: personId,
      IsMessagingEnabled: false, // should this default to true?
      IsSystem: false,
      Number: phoneNumber,
    });

    return personId;
  };

  authenticateWithSms = async ({ pin, phoneNumber }) => {
    const password = this.hashPassword({ pin });

    const personId = await this.createOrFindSmsLoginUserId({ phoneNumber });

    const { phoneNumber: cleanedNumber } = this.parsePhoneNumber({
      phoneNumber,
    });

    const userLogin = await this.request('/UserLogins')
      .filter(`UserName eq '${cleanedNumber}'`)
      .first();

    if (!userLogin) {
      throw new AuthenticationError('Invalid input');
    }
    // Update the user login to include the PersonId.
    await this.patch(`/UserLogins/${userLogin.id}`, { PersonId: personId });

    return this.authenticate({ identity: phoneNumber, password });
  };

  requestSmsLogin = async ({ phoneNumber: phoneNumberInput }) => {
    // E.164 Regex that twilio recommends
    // https://www.twilio.com/docs/glossary/what-e164
    const { valid, phoneNumber } = this.parsePhoneNumber({
      phoneNumber: phoneNumberInput,
    });

    if (!valid) {
      throw new UserInputError(`${phoneNumber} is not a valid phone number`);
    }

    const { pin, password } = this.generateSmsPinAndPassword();

    const existingUserLogin = await this.request('/UserLogins')
      .filter(`UserName eq '${phoneNumber}'`)
      .first();

    if (existingUserLogin) {
      await this.delete(`/UserLogins/${existingUserLogin.id}`);
    }

    await this.post('/UserLogins', {
      EntityTypeId: 27, // A default setting we use in Rock-person-creation-flow
      UserName: phoneNumber,
      PlainTextPassword: password,
    });

    this.context.dataSources.Sms.sendSms({
      to: phoneNumber,
      body: `Your login code is ${pin}`,
    });

    return { success: true };
  };
}
