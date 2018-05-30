import RestConnector from './rest';

const ROCK_API = process.env.ROCK_API || 'https://apollosrock.newspring.cc/api';
const ROCK_TOKEN = process.env.ROCK_TOKEN;

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
}