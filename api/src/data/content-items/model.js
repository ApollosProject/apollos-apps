export default class ContentItem {
  constructor(context) {
    this.context = context;
  }

  request = () => this.context.connectors.Rock.request('ContentChannelItems');

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
