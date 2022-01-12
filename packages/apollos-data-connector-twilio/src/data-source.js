import { DataSource } from 'apollo-datasource';
import Twilio from 'twilio';

export default class TwilioSms extends DataSource {
  async initialize({ context }) {
    this.context = context;
  }

  get twilioConfig() {
    return this.context.dataSources.Config?.TWILIO;
  }

  get twilio() {
    if (this._twilio) return this._twilio;
    if (this.twilioConfig.ACCOUNT_SID && this.twilioConfig.AUTH_TOKEN) {
      this._twilio = new Twilio(
        this.twilioConfig.ACCOUNT_SID,
        this.twilioConfig.AUTH_TOKEN
      );
      return this._twilio;
    }
    return null;
  }

  sendSms({ body, to, from = this.twilioConfig.FROM_NUMBER, ...args }) {
    return this.twilio.messages.create({
      body,
      to,
      from,
      ...args,
    });
  }
}
