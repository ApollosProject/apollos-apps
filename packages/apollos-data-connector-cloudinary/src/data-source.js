import { DataSource } from 'apollo-datasource';
import cloudinary from 'cloudinary';

const cleanUrl = (url) => {
  const val = url.replace(/:(443|80)/, '');
  return val;
};

export default class Cloudinary extends DataSource {
  async initialize({ context }) {
    this.context = context;
  }

  get cloudinaryUrl() {
    if (this._cloudinaryUrl) return this._cloudinaryUrl;
    // No url present, setup config
    this._cloudinaryUrl = this.context.dataSources.Config?.CLOUDINARY.URL;
    process.env.CLOUDINARY_URL = this._cloudinaryUrl;
    cloudinary.config(true);
    cloudinary.config({
      private_cdn: false,
      secure: true,
    });
    return this._cloudinaryUrl;
  }

  withCloudinary(_url = '', options) {
    const url = cleanUrl(_url);
    // If we call this function twice, only the first transform will be applied
    if (url.startsWith('https://res.cloudinary.com')) {
      return url;
    }
    if (this.cloudinaryUrl) {
      return cloudinary.url(url, {
        type: 'fetch',
        fetch_format: 'jpg',
        width: '750',
        crop: 'limit',
        quality: 'auto',
        ...options,
      });
    }
    return url;
  }
}
