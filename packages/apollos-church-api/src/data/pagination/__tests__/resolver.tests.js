import { resolver } from '..';

const { PaginationInfo } = resolver;

describe('PaginationInfo resolver', () => {
  it('should resolve a static value', () => {
    const resultStart = PaginationInfo.startCursor({
      startCursor: 'some-cursor',
    });
    expect(resultStart).toEqual('some-cursor');

    const resultEnd = PaginationInfo.endCursor({
      endCursor: 'some-cursor',
    });
    expect(resultEnd).toEqual('some-cursor');
  });
  it('should resolve a function', () => {
    const returnCursor = () => 'some-cursor';
    const resultStart = PaginationInfo.startCursor({
      startCursor: returnCursor,
    });

    expect(resultStart).toEqual('some-cursor');

    const resultEnd = PaginationInfo.endCursor({
      endCursor: returnCursor,
    });
    expect(resultEnd).toEqual('some-cursor');
  });
});
