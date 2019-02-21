import crypto from 'crypto';
import { AuthenticationError, UserInputError } from 'apollo-server';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import PhoneNumber from 'awesome-phonenumber';

import { secret } from '../auth/token';

export default class AuthSmsDataSource extends RockApolloDataSource {
  hashPassword = ({ pin }) =>
    crypto
      .createHash('sha256')
      .update(`${pin}${secret}`)
      .digest('hex');

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

  generateSmsPinAndPassword = () => {
    const pin = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');
    const password = this.hashPassword({ pin });

    return { pin, password };
  };

  createOrFindSmsLoginUserId = async ({ phoneNumber: inputPhoneNumber }) => {
    const { phoneNumber, countryCode } = this.parsePhoneNumber({
      phoneNumber: inputPhoneNumber,
    });
    const existingPhoneNumber = await this.request('/PhoneNumbers')
      .filter(`Number eq '${phoneNumber}'`)
      .first();

    if (existingPhoneNumber) {
      return existingPhoneNumber.personId;
    }

    const personId = await this.context.dataSources.Auth.createUserProfile({
      email: null,
    });

    await this.post('/PhoneNumbers', {
      PersonId: personId,
      IsMessagingEnabled: false, // should this default to true?
      IsSystem: false,
      Number: phoneNumber,
      CountryCode: countryCode,
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

    // Updating PlainTextPassword via Patch doesn't work, so we delete and recreate.
    if (existingUserLogin) {
      await this.delete(`/UserLogins/${existingUserLogin.id}`);
    }

    await this.post('/UserLogins', {
      EntityTypeId: 27, // A default setting we use in Rock-person-creation-flow
      UserName: phoneNumber,
      PlainTextPassword: password,
    });

    await this.context.dataSources.Sms.sendSms({
      to: e164,
      body: `Your login code is ${pin}`,
    });

    return { success: true };
  };
}
