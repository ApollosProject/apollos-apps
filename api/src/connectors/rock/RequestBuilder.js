import withQuery from 'with-query';

// Simple request builder for querying the Rock API.
// Would probably work against most OData APIs, but built to just
// tackle the specific needs of Apollos on top of Rock.
export default class RockRequestBuilder {
  constructor({ connector, resource }) {
    this.connector = connector;
    this.resource = resource;
  }

  query = {};

  get path() {
    let path = [this.resource];
    if (this.resourceId) path.push(this.resourceId);
    path = path.join('/');
    path = withQuery(path, this.query);
    console.log({ path });
    return path;
  }

  /**
   * Sends the request to the server, resolves with results
   * @returns promise
   */
  get = () => this.connector.get(this.path);

  /**
   * Find a single resource by ID
   */
  find = (id) => {
    this.resourceId = id;
    return this;
  };

  /**
   * Filter resources by an odata string
   */
  filter = (filter) => {
    const key = '$filter';
    if (this.query[key]) {
      this.query[key] = `(${this.query[key]}) or (${filter})`;
    } else {
      this.query[key] = filter;
    }
    return this;
  };

  /**
   * Order resources by a given attribute and direction
   * @param {string} name The name of the attribute to order by
   * @param {string} direction The direction to order results by. Defaults to 'asc'
   */
  orderBy = (name, direction = 'asc') => {
    this.query.$orderby = `${name} ${direction}`;
    return this;
  };

  /**
   * Only return the top N results. Used for pagination
   * @param {number} top
   */
  top = (top) => {
    this.query.$top = top;
    return this;
  };

  /**
   * Skip the first N results. Used for pagination
   * @param {number} skip
   */
  skip = (skip) => {
    this.query.$skip = skip;
    return this;
  };
}
