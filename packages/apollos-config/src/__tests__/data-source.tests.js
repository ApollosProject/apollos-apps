import ConfigDataSource, { reloadConfigs } from '../data-source';

describe('Config Data Source', () => {
  beforeEach(() => {
    // need this so it tries to load configs. fs.read functions are mocked.
    process.env.NODE_ENV = 'not-test';
  });
  it('must load global variables', () => {
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    expect(Config.BIBLE_API.KEY).toEqual('123456abc');
    expect(Config.DATABASE_URL).toEqual('postgres/default');
    expect(Config.config).toMatchSnapshot();
  });

  it('must load variables for a staging env staging', () => {
    process.env.ENV_STAGE = 'staging';
    reloadConfigs();

    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    expect(Config.DATABASE_URL).toEqual('postgres/staging');
  });
});
