import BaseAnalytics from './base';

export default class RockInteractionAnalytics extends BaseAnalytics {
  eventWhitelist = ['View Content'];

  track({ event, userId, sessionId, properties }) {
    if (!userId) {
      return null;
    }
    switch (event) {
      case 'View Content': {
        return this.trackViewContent({
          itemId: properties.itemId,
          title: properties.title,
          sessionId,
        });
      }
      default:
        console.log(`${event} not supported by RockInteraction Analytics`);
        return null;
    }
  }

  trackViewContent({ title, itemId, sessionId }) {
    if (!itemId || !sessionId) {
      console.log('No itemId or sessionId included in `track` call.');
      return null;
    }
    return this.context.dataSources.Interactions.createContentItemInteraction({
      itemId,
      itemTitle: title,
      sessionId,
      operationName: 'View Content',
    });
  }
}
