import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS } = ApollosConfig;

export default class ContentChannel extends RockApolloDataSource {
  resource = 'ContentChannels';

  all = () =>
    this.request()
      .expand('ChildContentChannels')
      .get();

  getRootChannels = () =>
    this.request()
      .filter(
        ROCK_MAPPINGS.DISCOVER_CONTENT_CHANNEL_IDS.map(
          (channelId) => `(Id eq ${channelId})`
        ).join(' or ')
      )
      .cache({ ttl: 5 })
      .get();

  getFromId = (id) =>
    this.request()
      .filter(`Id eq ${id}`)
      .expand('ChildContentChannels')
      .first();
}
