export default {
  Mutation: {
    updateUserPushSettings: (
      root,
      { input: { enabled, pushProviderUserId } },
      { dataSources }
    ) =>
      dataSources.NotificationPreference.updateNotificationPreferences({
        notificationProviderId: pushProviderUserId,
        notificationProviderType: 'one_signal', // hard coded for now
        enabled,
      }),
  },
};
