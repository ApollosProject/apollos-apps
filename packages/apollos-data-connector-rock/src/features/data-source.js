import { flatten, get } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { createGlobalId } from '@apollosproject/server-core';

export default class Features extends RockApolloDataSource {
  resource = '';

  // Names of Action Algoritms mapping to the functions that create the actions.
  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    PERSONA_FEED: this.personaFeedAlgorithm.bind(this),
    CONTENT_CHANNEL: this.contentChannelAlgorithm.bind(this),
    SERMON_CHILDREN: this.sermonChildrenAlgorithm.bind(this),
  };

  async createActionListFeature({ algorithms = [], title, subtitle }) {
    // Generate a list of actions.
    // We should flatten just in case a single algorithm generates multiple actions
    const actions = flatten(
      await Promise.all(
        algorithms.map(async (algorithm) => {
          // Lookup the algorithm function, based on the name, and run it.
          if (typeof algorithm === 'object') {
            return this.ACTION_ALGORITHIMS[algorithm.type](algorithm.arguments);
          }
          return this.ACTION_ALGORITHIMS[algorithm]();
        })
      )
    );
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: createGlobalId(
        actions
          .map(({ relatedNode: { id } }) => id)
          .reduce((acc, sum) => acc + sum, 0),
        'ActionListFeature'
      ),
      actions,
      title,
      subtitle,
      // Typanme is required so GQL knows specifically what Feature is being created
      __typename: 'ActionListFeature',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  createTextFeature({ text, id }) {
    return {
      body: text,
      id: createGlobalId(id, 'TextFeature'),
      __typename: 'TextFeature',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  createScriptureFeature({ reference, id }) {
    return {
      reference,
      id: createGlobalId(id, 'ScriptureFeature'),
      __typename: 'ScriptureFeature',
    };
  }

  async personaFeedAlgorithm() {
    const { ContentItem } = this.context.dataSources;

    // Get the first three persona items.
    const personaFeed = await ContentItem.byPersonaFeed(3);
    const items = await personaFeed.get();

    // Map them into specific actions.
    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
    }));
  }

  async contentChannelAlgorithm({ contentChannelId, limit = null } = {}) {
    if (contentChannelId == null) {
      throw new Error(
        `contentChannelId is a required argument for the CONTENT_CHANNEL ActionList algorithm.
Make sure you structure your algorithm entry as \`{ type: 'CONTENT_CHANNEL', aruments: { contentChannelId: 13 } }\``
      );
    }

    const { ContentItem } = this.context.dataSources;
    const cursor = ContentItem.byContentChannelId(contentChannelId);

    const items = limit ? await cursor.top(limit).get() : await cursor.get();

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
    }));
  }

  async sermonChildrenAlgorithm({ limit = null } = {}) {
    const { ContentItem } = this.context.dataSources;

    const sermon = await ContentItem.getSermonFeed().first();
    if (!sermon) {
      return [];
    }

    const cursor = await ContentItem.getCursorByParentContentItemId(sermon.id);
    const items = limit ? await cursor.top(limit).get() : await cursor.get();

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
    }));
  }
}
