import RestConnector from '../rest';
import RequestBuilder from './RequestBuilder';

const {
  ROCK_API = 'https://apollosrock.newspring.cc/api',
  ROCK_TOKEN,
} = process.env;

export default class RockConnector extends RestConnector {
  constructor() {
    super({
      batch: false,
      baseUrl: ROCK_API,
      defaultRequestOptions: {
        headers: {
          'Authorization-Token': ROCK_TOKEN,
        },
      },
    });
  }

  request = (resource) =>
    new RequestBuilder({
      resource,
      connector: this,
    });
}
