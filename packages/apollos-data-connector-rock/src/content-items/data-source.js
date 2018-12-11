import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS } = ApollosConfig;
const LIVE_CONTENT = (date = new Date()) =>
  `(StartDateTime lt datetime'${date.toISOString()}') and (ExpireDateTime gt datetime'${date.toISOString()}')`;

export default class ContentItem extends RockApolloDataSource {
  resource = 'ContentChannelItems';

  expanded = true;

  getCursorByParentContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ContentChannelItemId eq ${id}`)
      .get();

    if (!associations || !associations.length) return null;
    const request = this.request();
    associations.forEach(({ childContentChannelItemId }) => {
      request.filter(`Id eq ${childContentChannelItemId}`);
    });

    return request.filter(LIVE_CONTENT(), 'and').orderBy('Order');
  };

  getCursorByChildContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ChildContentChannelItemId eq ${id}`)
      .get();

    if (!associations || !associations.length) return null;
    const request = this.request();
    associations.forEach(({ contentChannelItemId }) => {
      request.filter(`Id eq ${contentChannelItemId}`);
    });

    return request.filter(LIVE_CONTENT(), 'and').orderBy('Order');
  };

  getCursorBySiblingContentItemId = async (id) => {
    // Get all parents for the current item.
    const parentAssociations = await this.request(
      'ContentChannelItemAssociations'
    )
      .filter(`ChildContentChannelItemId eq ${id}`)
      .get();

    if (!parentAssociations || !parentAssociations.length) return null;

    // Now, fetch all children relations for those parents (excluding the original item)
    const siblingAssociationsRequest = await this.request(
      'ContentChannelItemAssociations'
    );
    parentAssociations.forEach(({ contentChannelItemId }) => {
      siblingAssociationsRequest.filter(
        `(ContentChannelItemId eq ${contentChannelItemId}) and (ChildContentChannelItemId ne ${id})`
      );
    });
    const siblingAssociations = await siblingAssociationsRequest.get();
    if (!siblingAssociations || !siblingAssociations.length) return null;

    const request = this.request();
    siblingAssociations.forEach(({ childContentChannelItemId }) => {
      request.filter(`Id eq ${childContentChannelItemId}`);
    });

    return request.filter(LIVE_CONTENT(), 'and').orderBy('Order');
  };

  byUserFeed = () =>
    this.request()
      .filter(
        ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS.map(
          (id) => `(ContentChannelId eq ${id})`
        ).join(' or ')
      )
      .filter(LIVE_CONTENT(), 'and')
      .orderBy('StartDateTime', 'desc');

  byContentChannelId = (id) =>
    this.request()
      .filter(`ContentChannelId eq ${id}`)
      .filter(LIVE_CONTENT(), 'and')
      .orderBy('StartDateTime', 'desc');

  getFromIds = (ids) => {
    const filter = ids.map((id) => `(Id eq ${id})`).join(' or ');
    return this.request()
      .filter(filter)
      .filter(LIVE_CONTENT(), 'and');
  };

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}

console.log(LIVE_CONTENT());
