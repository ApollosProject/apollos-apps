import { RockModel } from '../../connectors/rock';

export default class ContentChannel extends RockModel {
  resource = 'ContentChannels';

  all = () => this.request().get();

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}
