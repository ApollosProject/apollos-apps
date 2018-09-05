import Analytics from 'analytics-node';

export default class GoogleAnalytics {
  constructor(writeKey) {
    this.client = new Analytics(writeKey);
  }

  shouldIdentify = true;

  shouldTrack = true;

  identify({ anonymousId, userId, traits, context }) {
    this.client.identify({
      anonymousId,
      userId,
      traits,
      context,
    });
  }

  track({ event, anonymousId, userId, properties, context }) {
    this.client.track({
      event,
      anonymousId,
      userId,
      properties,
      context,
    });
  }
}
