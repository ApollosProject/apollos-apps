import { flatten } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { createGlobalId } from '@apollosproject/server-core';

export default class Features extends RockApolloDataSource {
  resource = '';

  // Names of Action Algoritms mapping to the functions that create the actions.
  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    PERSONA_FEED: this.personaFeedAlgorithm.bind(this),
  };

  async createActionListFeature({ algorithms = [], title, subtitle }) {
    // Generate a list of actions.
    // We should flatten just in case a single algorithm generates multiple actions
    const actions = flatten(
      await Promise.all(
        algorithms.map(async (algorithm) =>
          // Lookup the algorithm function, based on the name, and run it.
          this.ACTION_ALGORITHIMS[algorithm]()
        )
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

  async personaFeedAlgorithm() {
    const { ContentItem } = this.context.dataSources;

    // Get the first three persona items.
    const personaFeed = await ContentItem.byPersonaFeed(3);
    const items = await personaFeed.get();

    // Map them into specific actions.
    return items.map((item, i) => ({
      id: createGlobalId(item.id + i, 'ActionListAction'),
      title: item.title,
      subtitle: item.contentChannel.name,
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
    }));
  }
}
