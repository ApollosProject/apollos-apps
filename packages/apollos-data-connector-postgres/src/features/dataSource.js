import { Feature as RockFeature } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import { PostgresDataSource, isUuid } from '../postgres';

// We have to do something unfortunate in this file for the time being.
// We essentially are incorperating methods from the Rock datasource
// (that don't rely on Rock) into the Postgres datasource.
// In the future, these methods will no longer be needed, since Feeds
// Will be stored in Postgres. In the meantime though, we need to pull
// these methods in as a mixin.
const RockFeatureDataSource = RockFeature.dataSource.prototype;

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

  async createActionListFeature(...args) {
    return RockFeatureDataSource.createActionListFeature.call(this, ...args);
  }

  async createActionBarFeature(...args) {
    return RockFeatureDataSource.createActionBarFeature.call(this, ...args);
  }

  async createActionTableFeature(...args) {
    return RockFeatureDataSource.createActionTableFeature.call(this, ...args);
  }

  async createHeroListFeature(...args) {
    return RockFeatureDataSource.createHeroListFeature.call(this, ...args);
  }

  async createVerticalCardListFeature(...args) {
    return RockFeatureDataSource.createVerticalCardListFeature.call(
      this,
      ...args
    );
  }

  async createHorizontalCardListFeature(...args) {
    return RockFeatureDataSource.createHorizontalCardListFeature.call(
      this,
      ...args
    );
  }

  async createPrayerListFeature(...args) {
    return RockFeatureDataSource.createPrayerListFeature.call(this, ...args);
  }

  async createFollowPeopleFeature(...args) {
    return RockFeatureDataSource.createFollowPeopleFeature.call(this, ...args);
  }

  async createVerticalPrayerListFeature(...args) {
    return RockFeatureDataSource.createVerticalPrayerListFeature.call(
      this,
      ...args
    );
  }

  async createWebViewFeature(...args) {
    return RockFeatureDataSource.createWebViewFeature.call(this, ...args);
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

  getFeatures = async (featuresConfig = [], args = {}) => {
    return Promise.all(
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
  };

  getTabs = (args) => {
    return ApollosConfig.APP_TABS.map(({ title, icon, features }) => ({
      title,
      icon,
      feed: {
        __typename: 'FeatureFeed',
        id: createGlobalId(JSON.stringify({ features, args }), 'FeatureFeed'),
        features: () => this.getFeatures(features, args),
      },
    }));
  };
}

export { Feature as default };
