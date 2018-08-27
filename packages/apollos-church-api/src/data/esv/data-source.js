import { RESTDataSource } from 'apollo-datasource-rest';

export default class ESVScripture extends RESTDataSource {
  resource = 'ESVScripture';

  baseURL = 'https://api.esv.org/v3/';

  token = process.env.ESV_KEY;

  willSendRequest(request) {
    request.headers.set('Authorization', `Token ${this.token}`);
  }

  async getScripture(query) {
    let request = query;
    request += '&include-headings=false';
    request += '&include-passage-references=false';
    request += '&include-footnotes=false';
    request += '&include-audio-link=false';
    request += '&include-short-copyright=false';
    return this.get(`passage/html/?q=${request}`);
  }
}
