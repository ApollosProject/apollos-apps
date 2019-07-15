import { parseKeyValueAttribute } from '../utils';

describe('parseKeyValueAttribute', () => {
  it('should parse a rock key/value into a list of JS objects', () => {
    expect(
      parseKeyValueAttribute('this is a key^and some sort of value')
    ).toEqual([
      {
        key: 'this is a key',
        value: 'and some sort of value',
      },
    ]);
  });

  it('should parse multiple rock key/values into a list of JS objects', () => {
    expect(
      parseKeyValueAttribute(
        'this is a key^and some sort of value|another key^and another value'
      )
    ).toEqual([
      {
        key: 'this is a key',
        value: 'and some sort of value',
      },
      {
        key: 'another key',
        value: 'and another value',
      },
    ]);
  });

  it('should handle no arguments', () => {
    expect(parseKeyValueAttribute()).toEqual([]);
  });

  it('should handle empty string arguemnts', () => {
    expect(parseKeyValueAttribute('')).toEqual([]);
  });
});
