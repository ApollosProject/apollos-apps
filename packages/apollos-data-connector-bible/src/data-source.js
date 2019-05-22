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
    const scriptures = await this.getScriptures(query);
    if (scriptures[0]) {
      return scriptures[0];
    }
    return null;
  }

  async getScriptures(query) {
    const bibleId = BIBLE_API.BIBLE_ID;
    const scriptures = await this.get(`${bibleId}/search?query=${query}`);
    // Bible.api has a history of making unexpected API changes.
    // At one point scriptures had a sub field, "passages"
    // At another point, they returned the passage data on the `data` key directly.
    // We should handle both for the time being.
    if (get(scriptures, 'data.passages')) {
      return scriptures.data.passages;
    }
    return scriptures.data;
  }
}
