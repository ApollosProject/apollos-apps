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
          contentId: properties.itemId,
          title: properties.title,
          sessionId,
        });
      }
      default:
        console.log(`${event} not supported by RockInteraction Analytics`);
        return null;
    }
  }

  trackViewContent({ title, contentId, sessionId }) {
    if (!contentId || !sessionId) {
      console.log('No ContentId or SessionId included in `track` call.');
      return null;
    }
    return this.context.dataSources.Interactions.createContentItemInteraction({
      nodeId: contentId,
      nodeTitle: title,
      sessionId,
      operationName: 'View Content',
    });
  }
}
