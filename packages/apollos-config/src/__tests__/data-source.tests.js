import ConfigDataSource, { reloadConfigs, mergeConfigs } from '../data-source';
import ConfigClass from '../config';

describe('Config Data Source', () => {
  beforeEach(() => {
    // need this so it tries to load configs. fs.read functions are mocked.
    process.env.NODE_ENV = 'not-test';
  });
  it('must load global variables', () => {
    process.env.ENV_STAGE = 'production';
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
  it('must merge configs giving priority to the church config', () => {
    const sharedConfig = {
      BIBLE_API: { KEY: 'SHARED_BIBLE_API_KEY' },
      BUGSNAG: { API_KEY: 'SHARED_BUGSNAG_API_KEY' },
      CLOUDINARY: {
        URL: 'SHARED_CLOUDINARY_URL',
      },
      ALGOLIA: {
        APPLICATION_ID: 'SHARED_ALGOLIA_APPLICATION_ID',
        API_KEY: 'SHARED_ALGOLIA_API_KEY',
      },
      TWILIO: {
        ACCOUNT_SID: 'SHARED_TWILIO_SID',
        AUTH_TOKEN: 'SHARED_TWILIO_AUTH',
        FROM_NUMBER: 'SHARED_TWILIO_FROM',
      },
      SENDGRID: {
        API_KEY: 'SHARED_SENDGRID_API_KEY',
      },
    };
    const config = new ConfigClass();
    config.loadYaml({
      configPath: "doesn't matter because we're mocking fs",
      env: undefined,
    });
    const mergedConfig = mergeConfigs({ sharedConfig, config });
    expect(mergedConfig).toMatchSnapshot();
  });
});
