import crypto from 'crypto';
import { AuthenticationError, UserInputError } from 'apollo-server';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import PhoneNumber from 'awesome-phonenumber';
import { fieldsAsObject } from '../utils';

import { secret } from '../auth/token';

export default class AuthSmsDataSource extends RockApolloDataSource {
  expanded = true;

  hashPassword = ({ pin }) =>
    crypto.createHash('sha256').update(`${pin}${secret}`).digest('hex');

  parsePhoneNumber = ({ phoneNumber }) => {
    const number = new PhoneNumber(phoneNumber, 'US');

    return {
      valid: number.isValid(),
      phoneNumber: number.getNumber('significant'),
      countryCode: PhoneNumber.getCountryCodeForRegionCode(
        number.getRegionCode()
      ),
      // "The international public telecommunication numbering plan", twilio likes numbers to be in this format.
      e164: number.getNumber('e164'),
    };
  };

  userExists = async ({ identity }) => {
    const { valid, phoneNumber } = this.parsePhoneNumber({
      phoneNumber: identity,
    });

    let parsedIdentity = identity;
    if (valid) {
      parsedIdentity = phoneNumber;
    }

    const userExists = await this.context.dataSources.Auth.personExists({
      identity: parsedIdentity,
    });

    if (userExists) {
      // We are a Rock user and have logged in via sms or username/password
      return 'EXISTING_APP_USER';
    }
    return 'NONE';
  };

  generateSmsPinAndPassword = () => {
    const pin = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');
    const password = this.hashPassword({ pin });

    return { pin, password };
  };

  createPhoneNumber = ({ personId, phoneNumber, countryCode }) =>
    this.post('/PhoneNumbers', {
      PersonId: personId,
      IsMessagingEnabled: true,
      IsSystem: false,
      Number: phoneNumber,
      CountryCode: countryCode,
      NumberTypeValueId: 12, // 12 is a Constant Set in Rock, means "Mobile"
    });

  createOrFindSmsLoginUserId = async ({
    phoneNumber: inputPhoneNumber,
    userProfile,
  }) => {
    const { phoneNumber, countryCode } = this.parsePhoneNumber({
      phoneNumber: inputPhoneNumber,
    });

    const existingPhoneNumbers = await this.request('/PhoneNumbers')
      .filter(`Number eq '${phoneNumber}'`)
      .get();

    // If we have only one phone number, use that phone number
    if (existingPhoneNumbers.length === 1) {
      return existingPhoneNumbers[0].personId;
    }

    const profileFields = fieldsAsObject(userProfile || []);
    // Otherwise, create a new user.
    const personId = await this.context.dataSources.Auth.createUserProfile({
      Email: null,
      ...profileFields,
    });

    // And create their phone number.
    await this.createPhoneNumber({ personId, phoneNumber, countryCode });

    return personId;
  };

  authenticateWithSms = async ({
    pin,
    phoneNumber: phoneNumberInput,
    userProfile,
  }) => {
    const { phoneNumber } = this.parsePhoneNumber({
      phoneNumber: phoneNumberInput,
    });

    const userLogin = await this.request('/UserLogins')
      .filter(`UserName eq '${phoneNumber}'`)
      .first();

    if (!userLogin) {
      throw new AuthenticationError('Invalid input');
    }

    // remember that Rock null values are often empty objects!
    if (!userLogin.personId || typeof userLogin.personId === 'object') {
      // We created a login for this user, but don't know who they are yet.
      const personId = await this.createOrFindSmsLoginUserId({
        phoneNumber,
        userProfile,
      });

      // Update the user login to include the PersonId.
      await this.patch(`/UserLogins/${userLogin.id}`, { PersonId: personId });
    }

    const password = this.hashPassword({ pin });

    return this.context.dataSources.Auth.authenticate({
      identity: phoneNumber,
      password,
    });
  };

  requestSmsLogin = async ({ phoneNumber: phoneNumberInput }) => {
    // E.164 Regex that twilio recommends
    // https://www.twilio.com/docs/glossary/what-e164
    const { valid, phoneNumber, e164 } = this.parsePhoneNumber({
      phoneNumber: phoneNumberInput,
    });

    if (!valid) {
      throw new UserInputError(`${phoneNumber} is not a valid phone number`);
    }

    const { pin, password } = this.generateSmsPinAndPassword();

    const existingUserLogin = await this.request('/UserLogins')
      .filter(`UserName eq '${phoneNumber}'`)
      .first();

    let personOptions = {};

    // Updating PlainTextPassword via Patch doesn't work, so we delete and recreate.
    if (existingUserLogin) {
      // if we have a PersonId on the user login, we should move it over to the new login.
      if (existingUserLogin.personId)
        personOptions = { PersonId: existingUserLogin.personId };

      await this.delete(`/UserLogins/${existingUserLogin.id}`);
    }

    await this.post('/UserLogins', {
      EntityTypeId: 27, // A default setting we use in Rock-person-creation-flow
      UserName: phoneNumber,
      PlainTextPassword: password,
      ...personOptions, // { PersonId: ID } OR null
    });

    await this.context.dataSources.Sms.sendSms({
      to: e164,
      body: `Your login code is ${pin}`,
    });

    return {
      success: true,
      userAuthStatus: existingUserLogin ? 'EXISTING_APP_USER' : 'NONE',
    };
  };
}
