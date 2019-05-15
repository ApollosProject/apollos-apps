/* eslint-disable class-methods-use-this */
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

export default class LiveStream extends RESTDataSource {
  resource = 'LiveStream';

  get baseURL() {
    return ApollosConfig.CHURCH_ONLINE.URL;
  }

  async getLiveStream() {
    return this.get('events/current');
  }
}
