import { RESTDataSource } from 'apollo-datasource-rest';

export default class ESVScripture extends RESTDataSource {
  constructor() {
    super();
    this.resource = 'ESVScripture';
    this.baseURL = 'https://api.esv.org/v3/';
    this.token = 'f35be45bf85323278db2b9b5799d96f275745233';
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `token ${this.token}`);
  }

  async get(query) {
    return this.get(`passage/html/?q=${query}`);
  }
}
