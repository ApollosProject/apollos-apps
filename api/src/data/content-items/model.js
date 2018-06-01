import { RockModel } from '../../connectors/rock';

export default class ContentItem extends RockModel {
  resource = 'ContentChannelItems';

  getCursorByParentContentItemId = async (id) => {
    const associations = await this.context.connectors.Rock.request(
      'ContentChannelItemAssociations'
    )
      .filter(`ContentChannelItemId eq ${id}`)
      .get();

    const request = this.request();
    associations.forEach(({ childContentChannelItemId }) => {
      request.filter(`Id eq ${childContentChannelItemId}`);
    });

    return request.orderBy('Order');
  };

  byContentChannelId = (id) =>
    this.request().filter(`ContentChannelId eq ${id}`);

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}
