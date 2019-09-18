import ApollosConfig from '@apollosproject/config';

import Search from '../data-source';

ApollosConfig.loadJs({
  ALGOLIA: {
    APPLICATION_ID: 'some-application-id',
    API_KEY: 'some-api-key',
  },
});

describe('The algolia search dataSource', () => {
  it('must be able to perform a full index of data from the ContentItem dataSource', () => {
    const search = new Search();

    const ContentItem = {
      paginate: jest.fn(() => Promise.resolve([])),
      byActive: jest.fn(() => 'by-active-cursor'),
    };
  });
});
