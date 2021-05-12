import { get } from 'lodash';
import { RESTDataSource } from 'apollo-datasource-rest';
import ApollosConfig from '@apollosproject/config';

const { BIBLE_API } = ApollosConfig;
const ONE_DAY = 60 * 60 * 24;

export default class Scripture extends RESTDataSource {
  resource = 'Scripture';

  baseURL = 'https://api.scripture.api.bible/v1/bibles/';

  token = BIBLE_API.KEY;

  defaultVersion =
    BIBLE_API.DEFAULT_VERSION ||
    // TODO: BIBLE_IDS field is deprecated, remove this line once safe
    Object.keys(BIBLE_API.BIBLE_IDS || { WEB: '' })[0] ||
    'WEB';

  willSendRequest(request) {
    request.headers.set('api-key', `${this.token}`);
  }

  async getFromId(id) {
    const { id: parsedID, bibleId } = JSON.parse(id);
    const {
      data: { abbreviation: version },
    } = await this.get(`${bibleId}`, null, {
      cacheOptions: { ttl: ONE_DAY },
    });
    const { data } = await this.get(`${bibleId}/passages/${parsedID}`, null, {
      cacheOptions: { ttl: ONE_DAY },
    });
    return { ...data, version };
  }

  // TODO: deprecated
  async getScripture(query, version) {
    const scriptures = await this.getScriptures(query, version);
    if (scriptures[0]) {
      return scriptures[0];
    }
    return null;
  }

  getBook = async (bookId) => {
    const bibleId = await this.getBibleId('WEB');
    const {
      data: { name },
    } = await this.get(`${bibleId}/books/${bookId}`, null, {
      cacheOptions: { ttl: ONE_DAY },
    });
    return name;
  };

  getBibleId = async (version) => {
    const { data } = await this.get(
      `?abbreviation=${version.toUpperCase()}`,
      null,
      {
        cacheOptions: { ttl: ONE_DAY },
      }
    );
    if (!data.length) {
      console.warn(
        `${version.toUpperCase()} version unauthorized or invalid, using WEB version`
      );
      const res = await this.get(`?abbreviation=WEB`, null, {
        cacheOptions: { ttl: ONE_DAY },
      });
      return res.data[0].bibleId;
    }
    return data[0].bibleId;
  };

  async getScriptures(query, version = this.defaultVersion) {
    if (query === '') return [];
    const bibleId = await this.getBibleId(version);
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
        version: version.toUpperCase(),
      }));
    }
    console.warn(`No scripture returned, query: ${query} may be invalid`);
    return [];
  }
}
