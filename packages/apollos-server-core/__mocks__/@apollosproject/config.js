const ApollosConfig = jest.requireActual('@apollosproject/config');

const defaults = {
  APP: {
    UNIVERSAL_LINK_HOST: 'https://apollos.api',
    DEEP_LINK_HOST: 'apolloschurchapp',
  },
  UNIVERSAL_LINKS: {
    APPLE_APP_ID: 'test_id',
    APPLE_TEAM_ID: 'test_team_id',
    APP_STORE_LINK: 'app-store-link',
    PLAY_STORE_LINK: 'play-store-link',
    GOOGLE_APP_ID: 'some_app_id',
    GOOGLE_KEYSTORE_SHA256: 'some-google-keystore',
  },
};

ApollosConfig.default.loadJs(defaults);

class dataSource {
  constructor() {
    this.config = null;
    this.loadJs = this.loadJs.bind(this);
  }

  initialize({ context }) {
    if (context?.church?.slug) {
      const config = new ApollosConfig.Config();
      config.loadJs(defaults);
      this.config = config;
      this.attachConfigToClass(this.config);
    }
  }

  loadJs(input) {
    this.config.loadJs(input);
    this.attachConfigToClass(this.config);
  }

  attachConfigToClass(config) {
    Object.keys({ ...config }).forEach((key) => {
      if (key !== 'config') {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: config[key],
        });
      }
    });
  }
}

const fetchChurchConfig = () => {
  const config = new ApollosConfig.Config();
  config.loadJs(defaults);
  return config;
};

export { dataSource, fetchChurchConfig };
export default ApollosConfig;
