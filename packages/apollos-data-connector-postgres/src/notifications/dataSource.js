import { PostgresDataSource } from '../postgres';

class NotificationsDataSource extends PostgresDataSource {
  modelName = 'notifications';

  DELIVERY_METHODS = {
    one_signal: this.sendWithOneSignal,
  };

  NOTIFICATION_TYPES = {
    PRAYER: 'PRAYER',
  };

  async createAndSend({
    title = '',
    subtitle = '',
    body = '',
    data = {},
    personId,
    method = 'one_signal',
    type,
  }) {
    if (!personId)
      throw new Error('personId is required for sending a notification');
    if (!type || !Object.values(this.NOTIFICATION_TYPES).includes(type))
      throw new Error(
        'Passing a valid notification type is required for sending a notification'
      );
    if (!this.DELIVERY_METHODS[method])
      throw new Error(`${method} is not a valid delivery method`);

    const notification = await this.model.create({
      title,
      subtitle,
      body,
      data,
      personId,
      deliveryMethod: method,
      notificationType: type,
      scheduledAt: Date.now(),
    });

    const { notificationId } = await this.DELIVERY_METHODS[method](
      notification
    );

    await notification.update({
      externalNotificationId: notificationId,
      sentAt: Date.now(),
    });

    return notification;
  }

  // eslint-disable-next-line
  async sendWithOneSignal({ title, subtitle, body, data, personId }) {
    return { id: '123' };
  }
}

export { NotificationsDataSource as default };
