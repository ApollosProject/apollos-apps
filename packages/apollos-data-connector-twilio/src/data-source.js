import { DataSource } from 'apollo-datasource';
import ApollosConfig from '@apollosproject/config';
import Twilio from 'twilio';

const { TWILIO } = ApollosConfig;

export default class TwilioSms extends DataSource {
  constructor(...args) {
    super(...args);
    if (TWILIO.ACCOUNT_SID && TWILIO.AUTH_TOKEN) {
      this.twilio = new Twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);
    } else {
      console.warn(
        'You are using the twilio datasource without twilio credentials. To avoid issues, add Twilio credentials to your config.yml or remove the Twilio datasource'
      );
    }
  }

  //
  sendSms({ body, to, from = TWILIO.FROM_NUMBER, ...args }) {
    return this.twilio.messages.create({
      body,
      to,
      from,
      ...args,
    });
  }
}
