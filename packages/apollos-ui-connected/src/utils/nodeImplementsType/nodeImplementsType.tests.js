// eslint-disable-next-line no-unused-vars
import ApollosConfig from '@apollosproject/config';
import nodeImplementsType from '.';

jest.mock('@apollosproject/config', () => ({
  TYPEMAP: {
    WeekendContentItem: ['Node', 'Feature'],
  },
}));

describe('nodeImplementsType', () => {
  test('correctly detects implementation', () => {
    const nodeId = 'WeekendContentItem:abcd1234';
    const result = nodeImplementsType(nodeId, 'Node');
    expect(result).toBeTruthy();
  });
});
