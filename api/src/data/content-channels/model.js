export default class ContentChannel {
  constructor(context) {
    this.context = context;
  }

  request = () => this.context.connectors.Rock.request('ContentChannels');

  all = () => this.request().get();

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}
