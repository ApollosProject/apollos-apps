import { KeyValueCache } from 'apollo-server-caching';

export const buildGetMock = (response, dataSource) => {
  const get = jest.fn();
  if (Array.isArray(response) && Array.isArray(response[0])) {
    response.forEach((responseVal) => {
      get.mockReturnValueOnce(
        new Promise((resolve) => resolve(dataSource.normalize(responseVal)))
      );
    });
  }
  get.mockReturnValue(
    new Promise((resolve) => resolve(dataSource.normalize(response)))
  );
  return get;
};

export const buildContext = (serverConfig) => (req) => {
  const testContext = serverConfig.context(req);
  const testDataSources = serverConfig.dataSources();
  // Apollo Server does this internally.
  Object.values(testDataSources).forEach((dataSource) => {
    if (dataSource.initialize) {
      dataSource.initialize({ context: testContext, cache: KeyValueCache });
    }
  });
  testContext.dataSources = testDataSources;
  return testContext;
};
