import fetch from 'fetch';
import DataLoader from 'dataloader';
import url from 'url';

export const eTagCache = {};

/**
 * A base-level connector for wrapping JSON-based rest APIs
 *
 * Extend from this class when creating Connectors to other APIs:
 *
 * ```
 * class RockConnector extends RestConnector {
 *   constructor() {
 *     super({
 *       baseUrl: 'https://my-awesome-rock.church.com/api',
 *     });
 *   }
 * }
 * ```
 */
export default class RestConnector {
  constructor({
    baseUrl = '',
    batch = false,
  } = {}) {
    this.baseUrl = baseUrl;

    this.loader = new DataLoader(this.fetchWithCacheForDataLoader, {
      batch,
    });
  }

  // Used with DataLoader to fetch resources with eTag support
  fetchWithCacheForDataLoader = (urlInput = []) => {
    let urls = urlInput;
    if (!Array.isArray(urls)) urls = [urls];

    const options = {
      headers: {
        'user-agent': 'Apollos',
        'Content-Type': 'application/json',
      },
    };

    return Promise.all(urls.map((url) => {
      const cachedRes = eTagCache[url];
      if (cachedRes && cachedRes.etag) {
        options.headers['If-None-Match'] = cachedRes.etag;
      }

      return new Promise((resolve, reject) => {
        fetch(url, options)
          .then((response) => {
            if (response.status === 304) {
              resolve(cachedRes.result);
            }

            const body = response.json();
            const etag = response.headers.get('etag');
            if (etag) {
              eTagCache[url] = {
                result: body,
                etag,
              };
            }
            resolve(body);
          }).catch((err) => {
            eject(err);
          });
      });
    }));
  }

  get = path => this.loader.load(url.resolve(this.baseUrl, path));
}