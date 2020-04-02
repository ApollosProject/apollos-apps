import { parseGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import { flatten } from 'lodash';

export default class Interactions extends RockApolloDataSource {
  resource = 'Interactions';

  async createContentItemInteraction({ itemId, operationName, itemTitle }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id } = parseGlobalId(itemId);

    const interactionComponent = await RockConstants.contentItemInteractionComponent(
      {
        contentItemId: id,
        // Don't want to recreate channels if name changes
        // In the future, we could use itemTitle here.
        contentName: id,
      }
    );
    const currentUser = await Auth.getCurrentPerson();
    const interactionId = await this.post('/Interactions', {
      PersonAliasId: currentUser.primaryAliasId,
      InteractionComponentId: interactionComponent.id,
      InteractionSessionId: this.context.sessionId,
      Operation: operationName,
      InteractionDateTime: new Date().toJSON(),
      InteractionSummary: `${operationName} - ${itemTitle}`,
      InteractionData: `${
        ApollosConfig.APP.DEEP_LINK_HOST
      }://Interactions/ContentSingle?itemId=${itemId}`,
    });

    return this.get(`/Interactions/${interactionId}`);
  }

  async getInteractionsForCurrentUserAndNodes({ nodeIds, actions = [] }) {
    let currentUser;
    try {
      currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    } catch (e) {
      return [];
    }

    if (nodeIds.length === 0) {
      return [];
    }

    if (ApollosConfig.ROCK.USE_PLUGIN) {
      return this.request(
        `/Apollos/GetInteractionsByForeignKeys?keys=${nodeIds.join(',')}`
      )
        .filterOneOf(actions.map((a) => `Operation eq '${a}'`))
        .andFilter(`PersonAliasId eq ${currentUser.primaryAliasId}`)
        .get();
    }
    console.warn(
      'Fetching interactions without the Rock plugin is extremly inefficient\n\nWe highly recommend using plugin version 1.6.0 or higher'
    );
    return flatten(
      await Promise.all(
        nodeIds.map(async (nodeId) =>
          this.request()
            .filterOneOf(actions.map((a) => `Operation eq '${a}'`))
            .andFilter(
              `(ForeignKey eq '${nodeId}') and (PersonAliasId eq ${
                currentUser.primaryAliasId
              })`
            )
            .get()
        )
      )
    );
  }

  getNodeInteractionsForCurrentUser({ nodeId, actions = [] }) {
    return this.getInteractionsForCurrentUserAndNodes({
      nodeIds: [nodeId],
      actions,
    });
  }

  async createNodeInteraction({ nodeId, action }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id, __type } = parseGlobalId(nodeId);

    const entityType = await RockConstants.modelType(__type);

    if (!entityType) {
      console.error(
        'nodeId is an invalid (non-rock) entity type. This is not yet supported.'
      );
      return { success: false };
    }

    const interactionComponent = await RockConstants.interactionComponent({
      entityId: id,
      entityTypeId: entityType.id,
      entityTypeName: entityType.friendlyName,
    });

    const currentUser = await Auth.getCurrentPerson();
    await this.post('/Interactions', {
      PersonAliasId: currentUser.primaryAliasId,
      InteractionComponentId: interactionComponent.id,
      InteractionSessionId: this.context.sessionId,
      Operation: action,
      InteractionDateTime: new Date().toJSON(),
      InteractionSummary: `${action}`,
      ForeignKey: nodeId,
    });

    return {
      success: true,
      nodeId,
    };
  }
}
