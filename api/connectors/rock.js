import RestConnector from './rest';

const ROCK_API = process.env.ROCK_API || 'https://apollosrock.newspring.cc/api';

export default class RockConnector {
  constructor() {
    super({
      batch: false,
      baseUrl: ROCK_API,
    });
  }
}