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
    let get;
    let dataSource;
    beforeEach(() => {
      get = jest.fn();
      get.mockReturnValue(new Promise((resolve) => resolve([1, 2, 3])));
      dataSource = new RestDataSource();
      dataSource.request = (resource) =>
        new RequestBuilder({
          resource,
          connector: { get },
        });
    });

    it('paginates a cursor', () => {
      const cursor = dataSource.request('TestResource');
      const result = dataSource.paginate({ cursor });
      expect(result).toBeTruthy();
      expect(get.mock.calls[0][0]).toBe('TestResource?%24top=20&%24skip=0');
    });

    it('skips pages', () => {
      const cursor = dataSource.request('TestResource');
      const after = createCursor({ position: 25 });
      const result = dataSource.paginate({ cursor, args: { after } });
      expect(result).toBeTruthy();
      expect(get.mock.calls[0][0]).toBe('TestResource?%24top=20&%24skip=26');
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
      expect(get.mock.calls[0][0]).toBe('TestResource?%24top=2&%24skip=0');
    });
  });
});
