import { parseGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

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

  async getNodeInteractionsForCurrentUser({ nodeId, actions = [] }) {
    let currentUser;
    try {
      currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    } catch (e) {
      return [];
    }
    if (actions.length) {
      return this.request()
        .filterOneOf(actions.map((a) => `Operation eq '${a}'`))
        .andFilter(
          `(ForeignKey eq '${nodeId}') and (PersonAliasId eq ${
            currentUser.primaryAliasId
          })`
        )
        .get();
    }
    return this.request()
      .filter(
        `(ForeignKey eq '${nodeId}') and (PersonAliasId eq ${
          currentUser.primaryAliasId
        })`
      )
      .get();
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
