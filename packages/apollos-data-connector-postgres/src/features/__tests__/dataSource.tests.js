/* eslint-disable import/named, new-cap */
import { sequelize } from '../../postgres/index';
import {
  Feature,
  ContentItem,
  ContentItemCategory,
  ContentItemsConnection,
  Media,
} from '../../index';

import { setupPostgresTestEnv } from '../../utils/testUtils';

const context = {};

describe('Apollos Postgres Feature DataSource', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      Feature,
      ContentItem,
      ContentItemCategory,
      ContentItemsConnection,
      Media,
    ]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('renders a WebView feed', async () => {
    const featureDataSource = new Feature.dataSource();
    featureDataSource.initialize({ context });

    const result = await featureDataSource.getFeatures([
      {
        type: 'WebView',
        url: 'https://apollosapp.io/',
        title: 'Test WebView',
      },
    ]);

    expect(result).toMatchSnapshot();
  });
});
