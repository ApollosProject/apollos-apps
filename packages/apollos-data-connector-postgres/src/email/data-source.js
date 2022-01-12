import sendgrid from '@sendgrid/mail';
import { PostgresDataSource } from '../postgres';

export default class EmailDataSource extends PostgresDataSource {
  get sendgridConfig() {
    if (this.context.dataSources.Config?.SENDGRID) {
      sendgrid.setApiKey(this.context.dataSources.Config.SENDGRID.API_KEY);
      return this.context.dataSources.Config.SENDGRID;
    }
    return null;
  }

  sendEmail = async ({ toEmail, subject, text, html }) => {
    if (!toEmail || !subject || (!text && !html)) {
      throw new Error(
        'Must pass toEmail, subject, and either text or html to sendEmail'
      );
    }

    if (!this.sendgridConfig) {
      return;
    }

    const email = {
      to: toEmail,
      from: 'apps@apollos.app',
      subject,
      ...(text && { text }),
      ...(html && { html }),
    };

    await sendgrid.send(email);
  };
}
