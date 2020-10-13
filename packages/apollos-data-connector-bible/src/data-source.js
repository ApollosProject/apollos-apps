import { get } from 'lodash';
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

const { BIBLE_API } = ApollosConfig;
const ONE_DAY = 60 * 60 * 24;

export default class Scripture extends RESTDataSource {
  resource = 'Scripture';

  baseURL = 'https://api.scripture.api.bible/v1/bibles/';

  token = BIBLE_API.KEY;

  // default to the first one listed in the config
  availableVersions = Object.keys(BIBLE_API.BIBLE_ID);

  willSendRequest(request) {
    request.headers.set('api-key', `${this.token}`);
  }

  async getFromId(id) {
    const { id: parsedID, bibleId } = JSON.parse(id);
    const version = Object.keys(BIBLE_API.BIBLE_ID).find(
      (key) => BIBLE_API.BIBLE_ID[key] === bibleId
    );
    const { data } = await this.get(`${bibleId}/passages/${parsedID}`, null, {
      cacheOptions: { ttl: ONE_DAY },
    });
    return { ...data, version };
  }

  // NOTE: deprecated
  async getScripture(query, version) {
    const scriptures = await this.getScriptures(query, version);
    if (scriptures[0]) {
      return scriptures[0];
    }
    return null;
  }

  async getScriptures(query, version) {
    if (query === '') return [];
    let safeVersion = version ? version.toUpperCase() : null;
    if (!this.availableVersions.includes(safeVersion)) {
      console.warn(
        `${safeVersion} version not available, using ${
          this.availableVersions[0]
        }`
      );
      [safeVersion] = this.availableVersions;
    }
    const bibleId = BIBLE_API.BIBLE_ID[safeVersion];
    const scriptures = await this.get(
      `${bibleId}/search?query=${query}`,
      null,
      {
        cacheOptions: { ttl: ONE_DAY },
      }
    );
    if (get(scriptures, 'data.passages')) {
      return scriptures.data.passages.map((passage) => ({
        ...passage,
        version: safeVersion,
      }));
    }
    console.warn(`No scripture returned, query: ${query} may be invalid`);
    return [];
  }
}
