import { enforceCurrentUser } from './index';

describe('enforceCurrentUser', () => {
  it('must allow a user from two different sources to see itself', async () => {
    const testFunc = () => 'You passed!';
    const enforceTestFunc = enforceCurrentUser(testFunc);
    const result = await enforceTestFunc(
      { id: '123-abs', originType: 'rock', originId: '123' },
      null,
      {
        dataSources: {
          Auth: {
            getCurrentPerson: () => ({ id: 123 }),
          },
        },
      }
    );
    expect(result).toBe('You passed!');
  });
  it('must allow a user from the same source to see itself', async () => {
    const testFunc = () => 'You passed!';
    const enforceTestFunc = enforceCurrentUser(testFunc);
    const result = await enforceTestFunc(
      { id: '123-abs', originType: 'rock', originId: '123' },
      null,
      {
        dataSources: {
          Auth: {
            getCurrentPerson: () => ({
              id: '123-abs',
              originType: 'rock',
              originId: '123',
            }),
          },
        },
      }
    );
    expect(result).toBe('You passed!');
  });
  it('must not allow a different user from the same source to see another user', async () => {
    const testFunc = () => 'You passed!';
    const enforceTestFunc = enforceCurrentUser(testFunc);
    const result = await enforceTestFunc(
      { id: '456-abs', originType: 'rock', originId: '456' },
      null,
      {
        dataSources: {
          Auth: {
            getCurrentPerson: () => ({
              id: '123-abs',
              originType: 'rock',
              originId: '123',
            }),
          },
        },
      }
    );
    expect(result).toBe(null);
  });
  it('must not allow a different user from a different source to see another user', async () => {
    const testFunc = () => 'You passed!';
    const enforceTestFunc = enforceCurrentUser(testFunc);
    const result = await enforceTestFunc(
      { id: '456-abs', originType: 'rock', originId: '456' },
      null,
      {
        dataSources: {
          Auth: {
            getCurrentPerson: () => ({
              id: 123,
            }),
          },
        },
      }
    );
    expect(result).toBe(null);
  });
});
