import { RESTDataSource } from 'apollo-datasource-rest';

export default class ESVScripture extends RESTDataSource {
  constructor() {
    super();
    this.resource = 'ESVScripture';
    this.baseURL = 'https://api.esv.org/v3/';
    this.token = process.env.ESV_KEY;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `token ${this.token}`);
  }

  async get(query) {
    return this.get(`passage/html/?q=${query}`);
  }
}
