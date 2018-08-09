import { createCursor } from '/api/utils/cursor';
import RestDataSource from '../data-source';
import RequestBuilder from '../RequestBuilder';

describe('RestDataSource', () => {
  it('constructs', () => {
    expect(new RestDataSource()).toBeTruthy();
  });

  describe('the request method', () => {
    it("throws an error if you don't set a resource", () => {
      const model = new RestDataSource();
      expect(() => model.request()).toThrow();
    });

    it("returns the Rock connector's request object", () => {
      const context = {
        connectors: {
          Rock: {
            request: jest.fn(),
          },
        },
      };
      context.connectors.Rock.request.mockReturnValue('request response');
      const model = new RestDataSource();
      model.resource = 'TestResource';
      const request = model.request();
      expect(request).toBe('request response');
      expect(context.connectors.Rock.request.mock.calls.length).toBe(1);
      expect(context.connectors.Rock.request.mock.calls[0][0]).toBe(
        'TestResource'
      );
    });
  });

  describe('the paginate method', () => {
    let context;
    let get;

    beforeEach(() => {
      get = jest.fn();
      get.mockReturnValue(new Promise((resolve) => resolve([1, 2, 3])));
      context = {
        connectors: {
          Rock: {
            request: (resource) =>
              new RequestBuilder({
                resource,
                connector: { get },
              }),
          },
        },
      };
    });

    it('paginates a cursor', () => {
      const model = new RestDataSource(context);
      const cursor = context.connectors.Rock.request('TestResource');
      const result = model.paginate({ cursor });
      expect(result).toBeTruthy();
      expect(get.mock.calls[0][0]).toBe('TestResource?%24top=20&%24skip=0');
    });

    it('skips pages', () => {
      const model = new RestDataSource(context);
      const cursor = context.connectors.Rock.request('TestResource');
      const after = createCursor({ position: 25 });
      const result = model.paginate({ cursor, args: { after } });
      expect(result).toBeTruthy();
      expect(get.mock.calls[0][0]).toBe('TestResource?%24top=20&%24skip=26');
    });

    it('throws on an invalid `after` cursor', () => {
      const model = new RestDataSource(context);
      const cursor = context.connectors.Rock.request('TestResource');
      const after = createCursor({ bad: 'brah!' });
      const result = model.paginate({ cursor, args: { after } });
      expect(result).rejects.toThrow();
    });

    it('sets page size', () => {
      const model = new RestDataSource(context);
      const cursor = context.connectors.Rock.request('TestResource');
      const result = model.paginate({ cursor, args: { first: 2 } });
      expect(result).toBeTruthy();
      expect(get.mock.calls[0][0]).toBe('TestResource?%24top=2&%24skip=0');
    });
  });
});
