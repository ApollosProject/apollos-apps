import { createCursor } from '../cursor';
import RestDataSource from '../index';
import RequestBuilder from '../request-builder';

describe('RestDataSource', () => {
  it('constructs', () => {
    expect(new RestDataSource()).toBeTruthy();
  });

  // it('has configurable url and token', () => {
  //   setRockVariables({ url: 'http://example.com', token: 'some-token' });
  //   const datasource = new RestDataSource();
  //   expect(datasource.baseURL).toEqual('http://example.com');
  //   expect(datasource.rockToken).toEqual('some-token');
  // });

  describe('the paginate method', () => {
    let getFn;
    let dataSource;
    beforeEach(() => {
      getFn = jest.fn();
      getFn.mockReturnValue(new Promise((resolve) => resolve([1, 2, 3])));
      dataSource = new RestDataSource();
      dataSource.request = (resource) =>
        new RequestBuilder({
          resource,
          connector: { get: getFn },
        });
    });

    it('transforms into a more familiar case', () => {
      const result = dataSource.normalize({
        Id: 123,
        SubObject: { Id: 456, SomeValue: 'Something', NullData: null },
        SubArray: [1, 2, 3, 4],
        SubArrayWithObject: [{ Foo: 'Bar' }, { Foo: 'baz' }],
        Finally: null,
      });

      expect(result).toEqual({
        id: 123,
        subObject: { id: 456, someValue: 'Something', nullData: null },
        subArray: [1, 2, 3, 4],
        subArrayWithObject: [{ foo: 'Bar' }, { foo: 'baz' }],
        finally: null,
      });
    });

    it('paginates a cursor', () => {
      const cursor = dataSource.request('TestResource');
      const result = dataSource.paginate({ cursor });
      expect(result).toBeTruthy();
      expect(getFn.mock.calls[0][0]).toBe('TestResource?%24top=20&%24skip=0');
    });

    it('paginates an empty cursor', () => {
      const cursor = dataSource.request('TestResource').empty();
      const result = dataSource.paginate({ cursor });
      expect(result).toBeTruthy();
      expect(getFn.mock.calls.length).toBe(0);
    });

    it('skips pages', () => {
      const cursor = dataSource.request('TestResource');
      const after = createCursor({ position: 25 });
      const result = dataSource.paginate({ cursor, args: { after } });
      expect(result).toBeTruthy();
      expect(getFn.mock.calls[0][0]).toBe('TestResource?%24top=20&%24skip=26');
    });

    it('throws on an invalid `after` cursor', () => {
      const cursor = dataSource.request('TestResource');
      const after = createCursor({ position: 25 });
      const result = dataSource.paginate({ cursor, args: { after } });
      expect(result).rejects.toThrow();
    });

    it('sets page size', () => {
      const cursor = dataSource.request('TestResource');
      const result = dataSource.paginate({ cursor, args: { first: 2 } });
      expect(result).toBeTruthy();
      expect(getFn.mock.calls[0][0]).toBe('TestResource?%24top=2&%24skip=0');
    });

    it('sets default request options w/ no expansion', () => {
      const defaultOptions = dataSource.buildDefaultOptions();
      expect(defaultOptions).toEqual({});
    });
    it('sets default request options w/ rockAttributes', () => {
      dataSource.attributesLoaded = ['Dog', 'Cat'];
      const defaultOptions = dataSource.buildDefaultOptions();
      expect(defaultOptions).toEqual({
        loadAttributes: 'expanded',
        attributeKeys: 'Dog,Cat',
      });
    });
    it('sets default request options w/ expanded = true', () => {
      dataSource.expanded = true;
      const defaultOptions = dataSource.buildDefaultOptions();
      expect(defaultOptions).toEqual({
        loadAttributes: 'expanded',
      });
    });
  });
});
