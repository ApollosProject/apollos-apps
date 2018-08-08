import { dataSources } from './data';

export default () => ({
  LiveStream: new dataSources.LiveStream(),
  ContentChannel: new dataSources.ContentChannel(),
  ContentItem: new dataSources.ContentItem(),
  Person: new dataSources.Person(),
});
