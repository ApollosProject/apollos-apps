import { get } from 'lodash';
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

const { BIBLE_API } = ApollosConfig;

export default class Scripture extends RESTDataSource {
  resource = 'Scripture';

  baseURL = 'https://api.scripture.api.bible/v1/bibles/';

  token = BIBLE_API.KEY;

  willSendRequest(request) {
    request.headers.set('api-key', `${this.token}`);
  }

  async getScripture(query) {
    const bibleId = BIBLE_API.BIBLE_ID;
    const scriptures = await this.get(`${bibleId}/search?query=${query}`);
    if (get(scriptures, 'data[0]')) {
      return scriptures.data[0];
    }
    return null;
  }

  async getScriptures(query) {
    const bibleId = BIBLE_API.BIBLE_ID;
    const scriptures = await this.get(`${bibleId}/search?query=${query}`);
    return scriptures.data;
  }
}
