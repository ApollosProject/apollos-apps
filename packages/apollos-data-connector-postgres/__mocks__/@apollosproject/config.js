const ApollosConfig = jest.requireActual('@apollosproject/config');

const defaults = {
  APP: {
    UNIVERSAL_LINK_HOST: 'https://apollos.api',
    DEEP_LINK_HOST: 'apolloschurchapp',
  },
  CONTENT: {
    TYPES: ['UniversalContentItem', 'ContentSeriesContentItem'],
  },
  ROCK_MAPPINGS: {
    CONTENT_ITEM: {
      ContentSeriesContentItem: {
        EntityType: 'ContentChannelItem',
      },
      DevotionalContentItem: {
        EntityType: 'SomeOtherEntity',
      },
      MediaContentItem: {
        EntityType: 'ContentChannelItem',
      },
      UniversalContentItem: {
        EntityType: 'ContentChannelItem',
      },
      WeekendContentItem: {
        EntityType: 'ContentChannelItem',
      },
      ContentItem: {
        EntityType: 'ContentChannelItem',
      },
    },
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
