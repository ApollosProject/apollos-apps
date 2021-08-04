import FormData from 'form-data';

import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class BinaryFiles extends RockApolloDataSource {
  resource = 'BinaryFiles';

  getFromId(id) {
    return this.request().find(id).get();
  }

  async uploadFile({ stream, filename }) {
    const data = new FormData();

    data.append('file', stream, { filename });

    const response = await this.nodeFetch(
      `${this.baseURL}/BinaryFiles/Upload?binaryFileTypeId=5`,
      {
        method: 'POST',
        body: data,
        headers: {
          'Authorization-Token': this.rockToken,
          connection: 'keep-alive',
          'transfer-encoding': 'chunked',
          ...data.getHeaders(),
        },
      }
    );

    return response.text();
  }

  async findOrReturnImageUrl(image) {
    if (image == null) return image;

    const { url, id } = image;
    if (url && typeof url === 'string') {
      return url;
    }
    if (id != null && typeof id !== 'object') {
      const binaryImage = await this.getFromId(id);
      return binaryImage.url;
    }
    return null;
  }
}
