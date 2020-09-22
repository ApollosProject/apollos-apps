import withQuery from 'with-query';

// Simple request builder for querying the Rock API.
// Would probably work against most OData APIs, but built to just
// tackle the specific needs of Apollos on top of Rock.
export default class RockRequestBuilder {
  constructor({ connector, resource, defaultOptions = null }) {
    this.connector = connector;
    this.resource = resource;
    if (defaultOptions) {
      this.query = defaultOptions;
    }
  }

  query = {};

  transforms = [];

  options = {};

  get path() {
    let path = [this.resource];
    if (this.resourceId) path.push(this.resourceId);
    path = path.join('/');
    path = withQuery(path, this.query);
    return path;
  }

  /**
   * Sends a GET request to the server, resolves with results
   * @returns promise
   */
  get = ({ options = {}, body = {} } = {}) =>
    this.connector
      .get(this.path, body, { ...options, ...this.options })
      .then((results) => {
        if (this.transforms.length)
          return this.transforms.reduce(
            (current, transformer) => transformer(current),
            results
          );
        return results;
      });

  /**
   * Ends the request chain, ensuring that the caller of *get* will recieve an empty array.
   * Used in situations where we want to bypass Rock and return nothing.
   */
  empty = () => {
    this.get = () => Promise.resolve([]);
    this.count = () => Promise.resolve(0);
    return this;
  };

  /**
   * Sends a GET request to the server, resolves with the first promise
   * @returns promise
   */
  first = async ({ options = {}, body = {} } = {}) => {
    // Make sure we only get 1 result;
    this.top(1);
    const results = await this.get({ options, body });
    if (results.length) {
      return results[0];
    }
    return null;
  };

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
  filter = (filter, { operator } = { operator: 'or' }) => {
    if (!filter) {
      return this;
    }
    const key = '$filter';
    if (this.query[key]) {
      this.query[key] = `(${this.query[key]}) ${operator} (${filter})`;
    } else if (filter !== '') this.query[key] = filter;
    return this;
  };

  andFilter = (filter) => this.filter(filter, { operator: 'and' });

  orFilter = (filter) => this.filter(filter, { operator: 'or' });

  filterOneOf = (filters) => {
    if (filters.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(`
You are filtering oneOf 0 filters.
Normally this has the same effect as filtering with 0 filters.
It's recommended that rather than passing an empty array with filterOneOf,
check to make sure you have at least one element to filter by. If you don't,
you can return request.empty()
`);
    }
    const filter = filters.map((f) => `(${f})`).join(' or ');
    return this.filter(filter);
  };

  cache = ({ ttl }) => {
    this.options.cacheOptions = { ttl };
    return this;
  };

  /**
   * Expands resources inline
   */
  expand = (expand) => {
    let { $expand } = this.query;
    if (!$expand) {
      $expand = [];
    } else {
      $expand = $expand.split(',');
    }
    $expand.push(expand);
    this.query.$expand = $expand.join(',');
    return this;
  };

  /**
   * DEPRECATED - use this.sort()
   * Order resources by a given attribute and direction
   * @param {string} name The name of the attribute to order by
   * @param {string} direction The direction to order results by. Defaults to 'asc'
   */
  orderBy = (name, direction = 'asc') => {
    delete this.query.$orderby;
    this.query.$orderby = `${name} ${direction}`;
    return this;
  };

  /**
   * Sorts resources by a list of fields with a priority by order
   * @param {string} attributes - array of fields to sort by
   *
   * Example:
   * sort([{field: "Name", direction: "asc"}, {field: "Date", direction: "desc"}])
   * The above example will first sort by name in ascending order, then
   * by date in descending order
   */
  sort = (fields = [{ field: 'Id', direction: 'desc' }]) => {
    delete this.query.$orderby;
    this.query.$orderby = fields
      .map(({ field, direction }) => `${field} ${direction}`)
      .join(', ');
    return this;
  };

  /**
   * Only return the top N results. Used for pagination
   * @param {number} top
   */
  top = (top) => {
    if (!top) {
      delete this.query.$top;
      return this;
    }
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

  /**
   * Select which attributes to return
   * @param {string} select
   */
  select = (select) => {
    this.query.$select = select;
    return this;
  };

  /**
   * Fetches a count of all items that would be returned by the current cursor.
   * Warning: As of right now this could be computationally expensive.
   */
  count = async () => {
    // clone the cursor itself
    const cursor = new RockRequestBuilder({
      connector: this.connector,
      resource: this.resource,
    });
    // make sure to clone this.query, which gets mutated by top/skip
    cursor.query = { ...this.query };

    const result = await cursor
      .select('Id')
      .top(null)
      .skip(0)
      .get();

    return result.length;
  };

  /**
   * Transform the shape of the results.
   * This is ran _after_ data is requested and not
   * affected by other methods that are chained to the request
   */
  transform = (func) => {
    this.transforms.push(func);
    return this;
  };
}
