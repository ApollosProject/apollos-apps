import ua from 'universal-analytics';

export default class GoogleAnalytics {
  constructor(accountId) {
    this.accountId = accountId;
  }

  shouldIdentify = false;

  shouldTrack = true;

  track({ event, anonymousId }) {
    const visitor = ua(this.accountId, anonymousId, { strictCidFormat: false });
    visitor.event('Apollos App', event).send();
  }
}
