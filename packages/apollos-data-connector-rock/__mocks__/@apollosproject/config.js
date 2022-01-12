const ApollosConfig = require.requireActual('@apollosproject/config');

const defaults = {
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
    DATAVIEW_CATEGORIES: {
      PersonaId: 123,
    },
    HOME_FEATURE_CHANNEL_ID: 13,
    INTERACTIONS: {
      CHANNEL_NAME: 'Apollos App',
      COMPONENT_NAME: 'Apollos Content Item',
      CHANNEL_MEDIUM_TYPE_ID: 512,
    },
    ENTITY_TYPES: {
      ApollosGroup: 'Group',
    },
  },
  ROCK: {
    TIMEZONE: 'America/New_York',
    API_URL: 'https://apollosrock.newspring.cc/api',
    URL: 'https://apollosrock.newspring.cc',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    USE_AGENT: false,
    VERSION: 9.4,
  },
  HOME_FEATURES: [
    {
      algorithms: ['SERMON_CHILDREN', 'PERSONA_FEED'],
      subtitle: 'Explore what God calls you to today',
      title: 'FOR YOU',
    },
    {
      subtitle: "What's happening at apollos?",
      algorithms: [
        {
          type: 'CONTENT_CHANNEL',
          arguments: {
            contentChannelId: 13,
          },
        },
      ],
      title: 'BULLETIN',
    },
  ],
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

export { dataSource };
export default ApollosConfig;
