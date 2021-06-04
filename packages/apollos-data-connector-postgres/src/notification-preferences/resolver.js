export default {
  Mutation: {
    updateUserPushSettings: (
      root,
      { input: { enabled, pushProviderUserId } },
      { dataSources }
    ) =>
      dataSources.NotificationPreference.updateUserNotificationPreference({
        notificationProviderId: pushProviderUserId,
        notificationProviderType: 'one_signal', // hard coded for now
        enabled,
      }),
  },
};
