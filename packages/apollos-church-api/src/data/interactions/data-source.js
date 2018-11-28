import { AuthenticationError } from 'apollo-server';
import { parseGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class Interactions extends RockApolloDataSource {
  resource = 'Interactions';

  async createContentItemInteraction({ nodeId, operationName }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id } = parseGlobalId(nodeId);

    const interactionComponent = await RockConstants.contentItemInteractionComponent(
      {
        contentItemId: id,
      }
    );
    const currentUser = await Auth.getCurrentPerson();
    const interactionId = await this.post('/Interactions', {
      PersonAliasId: currentUser.primaryAliasId,
      InteractionComponentId: interactionComponent.id,
      InteractionSessionId: this.context.sessionId,
      Operation: operationName,
      InteractionDateTime: new Date().toJSON(),
      InteractionData:
        'https://apollosrock.newspring.cc/page/3?returnurl=%252f',
    });

    return this.get(`/Interactions/${interactionId}`);
  }

  async getCountByOperationForContentItem({ contentItemId, operation }) {
    const { dataSources } = this.context;
    const contentItemType = await dataSources.RockConstants.modelType(
      'ContentItem'
    );
    try {
      return (await this.request('Interactions')
        .filter(
          // eslint-disable-next-line prettier/prettier
          `(RelatedEntityId eq ${contentItemId}) and (Operation eq '${operation}') and (RelatedEntityTypeId eq ${
            contentItemType.id
          })`
        )
        .select('Id') // $count not supported, next best thing to make efficient
        .cache({ ttl: 1800 }) // TODO: whats the right way to do this?
        .get()).length;
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return [];
      }
      throw e;
    }
  }

  async getByCurrentUserForContentItem({ contentItemId }) {
    const { dataSources } = this.context;
    const contentItemType = await dataSources.RockConstants.modelType(
      'ContentItem'
    );
    try {
      const currentUser = await dataSources.Auth.getCurrentPerson();
      return this.request('Interactions')
        .filter(
          // eslint-disable-next-line prettier/prettier
          `(RelatedEntityId eq ${contentItemId}) and (RelatedEntityTypeId eq ${
            contentItemType.id
          }) and (PersonAliasId eq ${currentUser.primaryAliasId})`
        )
        .get();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return [];
      }
      throw e;
    }
  }

  async getByCurrentUserForContentItems() {
    const { dataSources } = this.context;
    const contentItemType = await dataSources.RockConstants.modelType(
      'ContentItem'
    );
    try {
      const currentUser = await dataSources.Auth.getCurrentPerson();
      return this.request('Interactions')
        .filter(
          // eslint-disable-next-line prettier/prettier
          `(RelatedEntityTypeId eq ${
            contentItemType.id
          }) and (PersonAliasId eq ${currentUser.primaryAliasId})`
        )
        .get();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return [];
      }
      throw e;
    }
  }
}
