/* eslint-disable no-console */
import { createGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource, isUuid } from '../postgres';

class Feature extends PostgresDataSource {
  modelName = 'feature';

  async getFromId(args, rootId, { info } = { info: {} }) {
    this.cacheControl = info.cacheControl;
    const [type, id] = rootId.split(':');
    // For new features - driven by Postgres
    if (isUuid(id)) {
      const model = await super.getFromId(id);
      return model;
    }
    // For old features - data stored in ID.
    const funcArgs = JSON.parse(args);
    const method = this[`create${type}`].bind(this);
    return method(funcArgs);
  }

  setCacheHint(args) {
    if (this.cacheControl) {
      this.cacheControl.setCacheHint(args);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  createFeatureId({ args }) {
    return JSON.stringify(args);
  }

  // eslint-disable-next-line class-methods-use-this
  attachActionIds({ relatedNode, ...action } = {}) {
    if (relatedNode && !relatedNode.id) {
      return {
        ...action,
        relatedNode: {
          ...relatedNode,
          id: createGlobalId(
            JSON.stringify(relatedNode),
            relatedNode.__typename
          ),
        },
      };
    }

    return { relatedNode, ...action };
  }

  getRelatedNode = async ({ action, ...args }) => {
    const { FeatureFeed } = this.context.dataSources;
    if (action === 'OPEN_FEED') {
      if (!args.features)
        throw new Error(
          'Must supply "features" argument with OPEN_FEED action'
        );
      return FeatureFeed.getFeed({ features: args.features });
    }
    return null;
  };

  async createActionListFeature({
    algorithms = [],
    title,
    subtitle,
    primaryAction,
    ...args
  }) {
    // Generate a list of actions.
    const { ActionAlgorithm } = this.context.dataSources;
    const actions = () => ActionAlgorithm.runAlgorithms({ algorithms, args });

    // Ensures that we have a generated ID for the Primary Action related node, if not provided.
    if (primaryAction) {
      // eslint-disable-next-line no-param-reassign
      primaryAction = this.attachActionIds(primaryAction);
    }

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          algorithms,
          title,
          subtitle,
          primaryAction,
          ...args,
        },
      }),
      actions,
      title,
      subtitle,
      primaryAction,
      // Typanme is required so GQL knows specifically what Feature is being created
      __typename: 'ActionListFeature',
    };
  }

  async createActionBarFeature({
    actions = [],
    title,
    algorithms = [],
    ...args
  }) {
    const { ActionAlgorithm } = this.context.dataSources;

    // Run algorithms if we have them, otherwise pull from the config
    const compiledActions = () =>
      actions.length
        ? actions.map((action) => this.attachActionIds(action))
        : ActionAlgorithm.runAlgorithms({ algorithms, args });

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          title,
          algorithms,
          actions,
        },
      }),
      actions: compiledActions,
      title,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'ActionBarFeature',
    };
  }

  async createActionTableFeature({
    actions = [],
    title,
    algorithms = [],
    ...args
  }) {
    const { ActionAlgorithm } = this.context.dataSources;

    // Run algorithms if we have them, otherwise pull from the config
    const compiledActions = () =>
      actions.length
        ? actions.map((action) => this.attachActionIds(action))
        : ActionAlgorithm.runAlgorithms({ algorithms, args });

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          title,
          algorithms,
          actions,
        },
      }),
      actions: compiledActions,
      title,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'ActionTableFeature',
    };
  }

  async createHeroListFeature({
    algorithms = [],
    heroAlgorithms = [],
    title,
    subtitle,
    primaryAction,
    ...args
  }) {
    // Generate a list of actions.
    let actions;
    let heroCard;
    const { ActionAlgorithm } = this.context.dataSources;

    // If we have a strategy for selecting the hero card.
    if (heroAlgorithms && heroAlgorithms.length) {
      // The actions come from the action algorithms
      actions = () => ActionAlgorithm.runAlgorithms({ algorithms, args });
      // and the hero comes from the hero algorithms
      heroCard = async () => {
        const cards = await ActionAlgorithm.runAlgorithms({
          algorithms: heroAlgorithms,
          args,
        });
        return cards.length ? cards[0] : null;
      };
      // Otherwise, if we don't have a strategy
    } else {
      // Get all the cards (sorry, no lazy loading here)
      const allActions = await ActionAlgorithm.runAlgorithms({
        algorithms,
        args,
      });
      // The actions are all actions after the first
      actions = allActions.slice(1);
      // And the hero is the first action.
      heroCard = allActions.length ? allActions[0] : null;
    }

    // Ensures that we have a generated ID for the Primary Action related node, if not provided.
    if (primaryAction) {
      // eslint-disable-next-line no-param-reassign
      primaryAction = this.attachActionIds(primaryAction);
    }

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          algorithms,
          heroAlgorithms,
          title,
          subtitle,
          primaryAction,
          ...args,
        },
      }),
      actions,
      heroCard,
      title,
      subtitle,
      primaryAction,
      // Typanme is required so GQL knows specifically what Feature is being created
      __typename: 'HeroListFeature',
    };
  }

  async createVerticalCardListFeature({
    algorithms = [],
    title,
    subtitle,
    isFeatured = false,
    ...args
  }) {
    // Generate a list of cards.
    const { ActionAlgorithm } = this.context.dataSources;
    const cards = () => ActionAlgorithm.runAlgorithms({ algorithms, args });
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          algorithms,
          title,
          subtitle,
          isFeatured,
          ...args,
        },
      }),
      cards,
      isFeatured,
      title,
      subtitle,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'VerticalCardListFeature',
    };
  }

  async createHorizontalCardListFeature({
    algorithms = [],
    hyphenatedTitle,
    title,
    subtitle,
    primaryAction,
    ...args
  }) {
    // Generate a list of horizontal cards.
    const { ActionAlgorithm } = this.context.dataSources;
    const cards = () => ActionAlgorithm.runAlgorithms({ algorithms, args });
    // Ensures that we have a generated ID for the Primary Action related node, if not provided.
    // Ensures that we have a generated ID for the Primary Action related node, if not provided.
    if (primaryAction) {
      // eslint-disable-next-line no-param-reassign
      primaryAction = this.attachActionIds(primaryAction);
    }

    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          algorithms,
          title,
          subtitle,
          primaryAction,
          ...args,
        },
      }),
      cards,
      hyphenatedTitle,
      title,
      subtitle,
      primaryAction,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'HorizontalCardListFeature',
    };
  }

  createPrayerListFeature({
    algorithms = ['DAILY_PRAYER'],
    title,
    subtitle = 'Daily Prayer',
    isCard = true,
    ...args
  }) {
    const { ActionAlgorithm } = this.context.dataSources;
    const prayers = () => ActionAlgorithm.runAlgorithms({ algorithms, args });
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args: {
          algorithms,
          title,
          subtitle,
          isCard,
          ...args,
        },
      }),
      prayers,
      title,
      subtitle,
      isCard,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'PrayerListFeature',
    };
  }

  async createVerticalPrayerListFeature({
    title,
    subtitle,
    algorithms,
    ...args
  }) {
    const { ActionAlgorithm } = this.context.dataSources;

    const prayers = () => ActionAlgorithm.runAlgorithms({ algorithms, args });

    return {
      id: this.createFeatureId({
        args: { title, subtitle, algorithms, ...args },
      }),
      prayers,
      title,
      subtitle,
      __typename: 'VerticalPrayerListFeature',
    };
  }

  createFollowPeopleFeature(args) {
    const { Follow } = this.context.dataSources;
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        args,
      }),
      suggestedPeople: Follow.getStaticSuggestedFollowsForCurrentPerson(),
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'FollowPeopleFeature',
    };
  }

  createWebViewFeature({ url, title, height = 500 }) {
    return {
      id: this.createFeatureId({
        args: { url, title },
      }),
      url,
      title,
      height,
      __typename: 'WebviewFeature',
    };
  }

  async getScriptureShareMessage(ref) {
    const { Scripture } = this.context.dataSources;
    const scriptures = await Scripture.getScriptures(ref);
    return scriptures
      .map(
        ({ content, reference }) =>
          `${content.replace(/<[^>]*>?/gm, '')} ${reference}`
      )
      .join('\n\n');
  }

  // deprecated
  getHomeFeedFeatures = () =>
    console.warn(
      'getHomeFeedFeatures is deprecated, please use FeatureFeed.getFeed({type: "apollosConfig", args: {"section": "home"}})'
    );

  getFeatures = async (featuresConfig = [], args = {}) =>
    Promise.all(
      featuresConfig.map((featureConfig) => {
        const finalConfig = { ...featureConfig, ...args };
        switch (featureConfig.type) {
          case 'ActionBar':
            return this.createActionBarFeature(finalConfig);
          case 'ActionTable':
            return this.createActionTableFeature(finalConfig);
          case 'VerticalCardList':
            return this.createVerticalCardListFeature(finalConfig);
          case 'HorizontalCardList':
            return this.createHorizontalCardListFeature(finalConfig);
          case 'HeroListFeature':
            console.warn(
              'Deprecated: Please use the name "HeroList" instead. You used "HeroListFeature"'
            );
            return this.createHeroListFeature(finalConfig);
          case 'HeroList':
            return this.createHeroListFeature(finalConfig);
          case 'PrayerList':
            return this.createPrayerListFeature(finalConfig);
          case 'VerticalPrayerList':
            return this.createVerticalPrayerListFeature(finalConfig);
          case 'WebView':
            return this.createWebViewFeature(finalConfig);
          case 'FollowPeople':
            return this.createFollowPeopleFeature(finalConfig);
          case 'ActionList':
          default:
            // Action list was the default in 1.3.0 and prior.
            return this.createActionListFeature(finalConfig);
        }
      })
    );
}

export { Feature as default };
