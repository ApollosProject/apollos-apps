const casual = require('casual');
const { createCursor, parseCursor } = require('../apollos-rock-cursor');

describe('Node', () => {
  it('`createCursor` should take a valid json shape and return a string', () => {
    const id = casual.word;

    expect(typeof createCursor({ id })).toEqual('string');
  });

  it('`createCursor` should be decodeable by `parseCursor`', () => {
    const id = 'molestiae';
    const cursor = createCursor({ id });

    expect(parseCursor(cursor)).toMatchSnapshot();
  });

  it('`parseCursor` should throw an error if cursor is invalid', () => {
    expect(() => parseCursor('blah-blah')).toThrow();
  });
});
