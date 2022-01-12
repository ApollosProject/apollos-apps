import { dataSource as ConfigDataSource } from '@apollosproject/config';

import Pass from '../PassGenerator';

const Config = new ConfigDataSource();
Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

describe('PassGenerator', () => {
  it('creates a valid Certificates object', async () => {
    const pass = new Pass({
      model: Config.PASS.TEMPLATES.EXAMPLE,
      context: {
        dataSources: { Config },
      },
    });

    expect(pass.Certificates).toMatchSnapshot();
  });
});
