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
    const { NotificationPreference } = this.context.dataSources;

    if (!personId)
      throw new Error('personId is required for sending a notification');
    if (!type || !Object.values(this.NOTIFICATION_TYPES).includes(type))
      throw new Error(
        'Passing a valid notification type is required for sending a notification'
      );
    if (!this.DELIVERY_METHODS[method])
      throw new Error(`${method} is not a valid delivery method`);

    const notificationPreference = await NotificationPreference.model.findOne({
      where: {
        personId,
        notificationProviderType: method,
        enabled: true,
      },
    });

    if (!notificationPreference) return null;

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

    const { id } = await this.DELIVERY_METHODS[method]({
      notification,
      notificationPreference,
    });

    await notification.update({
      externalNotificationId: id,
      sentAt: Date.now(),
    });

    return notification;
  }

  // eslint-disable-next-line
  async sendWithOneSignal({
    notification: { title, subtitle, body, data },
    notificationPreference: { notificationProviderId },
  }) {
    return this.context.dataSources.OneSignal.createNotification({
      content: body,
      heading: title,
      subtitle,
      include_player_ids: [notificationProviderId],
      ...data,
    });
  }
}

export { NotificationsDataSource as default };
