import { RockModel } from '../../connectors/rock';

export default class ContentItem extends RockModel {
  resource = 'ContentChannelItems';

  byParentContentItemId = (id) =>
    this.context.connectors.Rock.request('ContentChannelItemAssociations')
      .filter(`ContentChannelItemId eq ${id}`)
      .expand('ChildContentChannelItem')
      .orderBy('Order')
      .transform((associations) =>
        associations.map((association) => association.childContentChannelItem)
      );

  byContentChannelId = (id) =>
    this.request().filter(`ContentChannelId eq ${id}`);

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}
