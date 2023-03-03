jest.mock('react-native-config', () => ({
  SOME_ENV_VALUE: 'a value',
}));

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  const readFileSync = jest.fn();
  readFileSync.mockImplementation((filePath) => {
    // Simulate our error handling
    if (filePath.includes('fake')) {
      throw new Error(`${filePath} does not exist`);
    }
    if (filePath.includes('staging')) {
      return 'DATABASE_URL=postgres/staging';
    }
    if (filePath.includes('env')) {
      return 'DATABASE_URL=postgres/default';
    }
    if (filePath.includes('global')) {
      return originalModule.readFileSync('./src/__tests__/shared_test.yml');
    }
    return originalModule.readFileSync('./src/__tests__/test.yml');
  });

  const readdirSync = jest.fn(() => [
    'global.env',
    'global.config.yml',
    'apollos_demo.env',
    'apollos_demo.config.yml',
  ]);

  const module = {
    __esModule: true,
    ...originalModule,
    readFileSync,
    readdirSync,
  };
  return {
    default: module,
    ...module,
  };
});
