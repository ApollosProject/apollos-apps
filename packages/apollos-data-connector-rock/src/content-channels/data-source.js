import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

import { isEmpty } from 'lodash';

const { ROCK_MAPPINGS } = ApollosConfig;

export default class ContentChannel extends RockApolloDataSource {
  resource = 'ContentChannels';

  all = () => this.request().expand('ChildContentChannels').get();

  getRootChannels = async () => {
    const channels = await this.request()
      .filter(
        ROCK_MAPPINGS.DISCOVER_CONTENT_CHANNEL_IDS.map(
          (channelId) => `(Id eq ${channelId})`
        ).join(' or ')
      )
      .cache({ ttl: 5 })
      .get();

    const sortOrder = ROCK_MAPPINGS.DISCOVER_CONTENT_CHANNEL_IDS;
    // Sort order could be undefined or have no ids. There's no reason to iterate in this case.
    if (!sortOrder || isEmpty(sortOrder)) {
      return channels;
    }
    // Setup a result array.
    const result = [];
    sortOrder.forEach((configId) => {
      // Remove the matched element from the channel list.
      const channel = channels.splice(
        channels.findIndex(({ id }) => id === configId),
        1
      );
      // And then push it (or nothing) to the end of the result array.
      result.push(...channel);
    });
    // Return results and any left over channels.
    return [...result, ...channels];
  };

  getFromId = (id) =>
    this.request().filter(`Id eq ${id}`).expand('ChildContentChannels').first();
}
