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

  get = () => this.connector.get(this.path);

  find = (id) => {
    this.resourceId = id;
    return this;
  };

  filter = (filter) => {
    const key = '$filter';
    if (this.query[key]) {
      this.query[key] = `(${this.query[key]}) or (${filter})`;
    } else {
      this.query[key] = filter;
    }
    return this;
  };

  orderBy = (name, direction = 'asc') => {
    this.query.$orderby = `${name} ${direction}`;
    return this;
  };

  top = (top) => {
    this.query.$top = top;
    return this;
  };

  skip = (skip) => {
    this.query.$skip = skip;
    return this;
  };
}
