import { parseGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

const { DEEP_LINK_HOST } = ApollosConfig.APP;

export default class Interactions extends RockApolloDataSource {
  resource = 'Interactions';

  async createContentItemInteraction({ nodeId, operationName, nodeTitle }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id } = parseGlobalId(nodeId);

    const interactionComponent = await RockConstants.contentItemInteractionComponent(
      {
        contentItemId: id,
        contentName: id, // Don't want to recreate channels if name changes
      }
    );
    const currentUser = await Auth.getCurrentPerson();
    const interactionId = await this.post('/Interactions', {
      PersonAliasId: currentUser.primaryAliasId,
      InteractionComponentId: interactionComponent.id,
      InteractionSessionId: this.context.sessionId,
      Operation: operationName,
      InteractionDateTime: new Date().toJSON(),
      InteractionSummary: `${operationName} - ${nodeTitle}`,
      InteractionData: `${DEEP_LINK_HOST}://Interactions/ContentSingle?itemId=${nodeId}`,
    });

    return this.get(`/Interactions/${interactionId}`);
  }
}
