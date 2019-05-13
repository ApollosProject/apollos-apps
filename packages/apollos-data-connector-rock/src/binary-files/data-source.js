import FormData from 'form-data';

import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class BinaryFiles extends RockApolloDataSource {
  resource = 'BinaryFiles';

  getFromId(id) {
    return this.request()
      .find(id)
      .get();
  }

  async uploadFile({ filename, stream, length }) {
    const data = new FormData();
    data.append('file', stream, {
      filename,
      knownLength: length,
    });
    const response = await this.nodeFetch(
      `${this.baseURL}/BinaryFiles/Upload?binaryFileTypeId=5`,
      {
        method: 'POST',
        body: data,
        headers: {
          'Authorization-Token': this.rockToken,
          ...data.getHeaders(),
        },
      }
    );

    return response.text();
  }

  async findOrReturnImageUrl({ url, id }) {
    if (url && typeof url === 'string') {
      return url;
    }
    if (id != null && typeof id !== 'object') {
      const image = await this.getFromId(id);
      return image.url;
    }
    return null;
  }
}
