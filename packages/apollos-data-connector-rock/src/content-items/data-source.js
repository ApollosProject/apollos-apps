import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import moment from 'moment-timezone';

const { ROCK_MAPPINGS, ROCK } = ApollosConfig;

export default class ContentItem extends RockApolloDataSource {
  resource = 'ContentChannelItems';

  LIVE_CONTENT = () => {
    // get a date in the local timezone of the rock instance.
    // Rock doesn't respect timezone information, hence the need to warp the date
    const date = moment()
      .utc()
      .add(
        moment()
          .tz(ROCK.TIMEZONE)
          .utcOffset(),
        'minutes'
      );
    return `((StartDateTime lt datetime'${date.toISOString()}') or (StartDateTime eq null)) and ((ExpireDateTime gt datetime'${date.toISOString()}') or (ExpireDateTime eq null)) `;
  };

  expanded = true;

  getCursorByParentContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ContentChannelItemId eq ${id}`)
      .get();

    if (!associations || !associations.length) return null;

    const request = this.request();

    const associationsFilter = associations.map(
      ({ childContentChannelItemId }) => `Id eq ${childContentChannelItemId}`
    );
    request.filterOneOf(associationsFilter).andFilter(this.LIVE_CONTENT());

    return request.orderBy('Order');
  };

  getCursorByChildContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ChildContentChannelItemId eq ${id}`)
      .get();

    if (!associations || !associations.length) return null;
    const request = this.request();
    const associationsFilter = associations.map(
      ({ contentChannelItemId }) => `Id eq ${contentChannelItemId}`
    );

    request.filterOneOf(associationsFilter).andFilter(this.LIVE_CONTENT());

    return request.orderBy('Order');
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

    const parentFilter = parentAssociations.map(
      ({ contentChannelItemId }) =>
        `(ContentChannelItemId eq ${contentChannelItemId}) and (ChildContentChannelItemId ne ${id})`
    );
    siblingAssociationsRequest.filterOneOf(parentFilter);

    const siblingAssociations = await siblingAssociationsRequest.get();
    if (!siblingAssociations || !siblingAssociations.length) return null;

    const request = this.request();
    const siblingFilter = siblingAssociations.map(
      ({ childContentChannelItemId }) => `Id eq ${childContentChannelItemId}`
    );
    request.filterOneOf(siblingFilter).andFilter(this.LIVE_CONTENT());

    return request.orderBy('Order');
  };

  byUserFeed = () =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .andFilter(this.LIVE_CONTENT())
      .orderBy('StartDateTime', 'desc');

  byContentChannelId = (id) =>
    this.request()
      .filter(`ContentChannelId eq ${id}`)
      .andFilter(this.LIVE_CONTENT())
      .orderBy('StartDateTime', 'desc');

  getFromIds = (ids) =>
    this.request()
      .filterOneOf(ids.map((id) => `Id eq ${id}`))
      .andFilter(this.LIVE_CONTENT());

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}
