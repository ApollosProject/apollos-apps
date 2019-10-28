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

  async getFromId(id, version = 'WEB') {
    const bibleId = BIBLE_API.BIBLE_ID[version];
    const { data } = await this.get(`${bibleId}/passages/${id}`);
    return data;
  }

  async getScripture(query, version = 'WEB') {
    const scriptures = await this.getScriptures(query, version);
    if (scriptures[0]) {
      return scriptures[0];
    }
    return null;
  }

  async getScriptures(query, version = 'WEB') {
    const bibleId = BIBLE_API.BIBLE_ID[version];
    const scriptures = await this.get(`${bibleId}/search?query=${query}`);
    return Promise.all(
      scriptures.data.passages.map((passage) => ({
        ...passage,
        version: this.getVersion(version),
      }))
    );
  }

  async getVersion(version) {
    const bibleId = BIBLE_API.BIBLE_ID[version];
    const bible = await this.get(`${this.baseURL}${bibleId}`);
    return bible.data.abbreviationLocal;
  }
}
