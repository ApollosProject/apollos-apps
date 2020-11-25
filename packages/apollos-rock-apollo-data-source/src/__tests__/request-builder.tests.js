import RequestBuilder from '../request-builder';

describe('RequestBuilder', () => {
  let request;
  let connector;
  let get;

  beforeEach(() => {
    get = jest.fn((...args) => new Promise((resolve) => resolve(args)));
    connector = { get };
    request = new RequestBuilder({
      connector,
      resource: 'SomeResource',
    });
  });

  it('constructs', () => {
    expect(request).toBeTruthy();
  });

  it('gets requests', () => {
    expect(request.get()).resolves.toMatchSnapshot();
  });

  it('gets the first result', () => {
    expect(request.first()).resolves.toMatchSnapshot();
  });

  it('finds by id', () => {
    expect(request.find(1).get()).resolves.toMatchSnapshot();
  });

  it('filters', () => {
    expect(
      request.filter('Something eq SomethingElse').get()
    ).resolves.toMatchSnapshot();
  });
  it("doesn't filter if filter is blank", () => {
    expect(request.filter('').get()).resolves.toMatchSnapshot();
  });

  it('combines multiple filters with an and operator', () => {
    expect(
      request
        .filter('Something eq SomethingElse')
        .andFilter('AnotherThing eq SomethingDifferent')
        .get()
    ).resolves.toMatchSnapshot();
  });

  it('combines multiple filters with an or operator', () => {
    expect(
      request
        .filter('Something eq SomethingElse')
        .orFilter('AnotherThing eq SomethingDifferent')
        .get()
    ).resolves.toMatchSnapshot();
  });

  it('filters by one of a list of conditions', () => {
    expect(
      request.filterOneOf(['Id eq 123', 'Id eq 456', 'Id eq 789']).get()
    ).resolves.toMatchSnapshot();
  });
  it("doesn't filterOneOf if array is blank", () => {
    expect(request.filterOneOf([]).get()).resolves.toMatchSnapshot();
  });

  it('chains multiple filters', () => {
    expect(
      request.filter('A eq Ab').filter('B eq Bc').get()
    ).resolves.toMatchSnapshot();
  });

  it('expands', () => {
    expect(request.expand('Puppies').get()).resolves.toMatchSnapshot();
  });

  it('chains multiple expands', () => {
    expect(
      request.expand('Puppies').expand('Cats').get()
    ).resolves.toMatchSnapshot();
  });

  it('chains mixed-format expands', () => {
    expect(
      request.expand('Dogs/Puppies').expand('Cats,Kittens').get()
    ).resolves.toMatchSnapshot();
  });

  it('allows for pagination', () => {
    expect(request.top(2).skip(5).get()).resolves.toMatchSnapshot();
  });

  it('fetches a count', async () => {
    get = jest.fn(() => new Promise((resolve) => resolve([1, 2, 3])));
    connector = { get };
    request = new RequestBuilder({
      connector,
      resource: 'SomeResource',
    });

    const cursor = request.filter('Something').top(2).skip(5);

    const result = await cursor.count();

    expect(result).toMatchSnapshot();
    expect(cursor.query).toMatchSnapshot();
  });

  it('caches', () => {
    expect(request.cache({ ttl: 20 }).get()).resolves.toMatchSnapshot();
  });

  it('orders', () => {
    expect(request.orderBy('MyField').get()).resolves.toMatchSnapshot();
  });

  it('sorts', () => {
    expect(
      request
        .sort([
          { field: 'Name', direction: 'asc' },
          { field: 'Date', direction: 'desc' },
        ])
        .get()
    ).resolves.toMatchSnapshot();
  });

  it('selects', () => {
    expect(request.select('Id').get()).resolves.toMatchSnapshot();
  });

  it('orders in custom order', () => {
    expect(request.orderBy('MyField', 'desc').get()).resolves.toMatchSnapshot();
  });

  it('returns an empty array', () => {
    expect(request.empty().get()).resolves.toEqual([]);
  });

  it('transforms result shapes', () => {
    get = jest.fn(() => new Promise((resolve) => resolve({ a: 'yo' })));
    connector = { get };
    request = new RequestBuilder({
      connector,
      resource: 'SomeResource',
    });

    expect(
      request
        .transform((input) => {
          expect(input).toMatchSnapshot();
          return { b: 'neigh' };
        })
        .get()
    ).resolves.toMatchSnapshot();
  });
});
