import { dataSources } from './data';

export default () => ({
  liveStream: new dataSources.LiveStream(),
  contentChannel: new dataSources.ContentChannel(),
});
