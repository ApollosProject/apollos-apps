import ApollosConfig from '..';

describe('The ApollosConfig UI Package', () => {
  it('loads from JS', () => {
    ApollosConfig.loadJs({ A_COOL_VAR: 'some value' });
    expect(ApollosConfig.A_COOL_VAR).toBe('some value');
  });
  it('loads from react-native-config', () => {
    // We set this value in inside the jest.setup.js file.
    expect(ApollosConfig.SOME_ENV_VALUE).toBe('a value');
  });
  it('overrides react-native-config values', () => {
    // We set this value in inside the jest.setup.js file.
    ApollosConfig.loadJs({ SOME_ENV_VALUE: 'new value' });
    expect(ApollosConfig.SOME_ENV_VALUE).toBe('new value');
  });
});
