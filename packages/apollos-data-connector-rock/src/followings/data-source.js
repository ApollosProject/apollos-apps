import { AuthenticationError } from 'apollo-server';
import { parseGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class Followings extends RockApolloDataSource {
  resource = 'Followings';

  async updateLikeContentItem({ nodeId, operation }) {
    const {
      dataSources: { ContentItem },
    } = this.context;
    if (operation === 'Like') {
      await this.followNode({ nodeId });
    } else {
      await this.unFollowNode({ nodeId });
    }
    const { id } = parseGlobalId(nodeId);
    const item = await ContentItem.getFromId(id);
    return { ...item, isLiked: operation === 'Like' };
  }

  async followNode({ nodeId }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id, __type } = parseGlobalId(nodeId);

    const currentUser = await Auth.getCurrentPerson();
    const nodeType = await RockConstants.modelType(__type);

    const followingsId = await this.post('/Followings', {
      PersonAliasId: currentUser.primaryAliasId,
      EntityTypeId: nodeType.id,
      EntityId: id,
    });

    return this.get(`/Followings/${followingsId}`);
  }

  async unFollowNode({ nodeId }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);
    const currentUser = await Auth.getCurrentPerson();
    // currentUser.id is correct, this path does not use aliasId
    return this.delete(`/Followings/${nodeType.id}/${id}/${currentUser.id}`);
  }

  async getFollowingsCountByNodeId({ nodeId }) {
    const {
      dataSources: { RockConstants },
    } = this.context;

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);

    return (await this.request('Followings')
      .filter(
        // eslint-disable-next-line prettier/prettier
          `(EntityId eq ${id}) and (EntityTypeId eq ${nodeType.id})`
      )
      .select('Id') // $count not supported, next best thing to make efficient
      .cache({ ttl: 1800 }) // TODO: whats the right way to do this?
      .get()).length;
  }

  async getFollowingsForCurrentUserAndNode({ nodeId }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);
    try {
      const currentUser = await Auth.getCurrentPerson();
      return this.request('Followings')
        .filter(
          // eslint-disable-next-line prettier/prettier
          `(EntityId eq ${id}) and (EntityTypeId eq ${nodeType.id}) and (PersonAliasId eq ${currentUser.primaryAliasId})`
        )
        .get();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return [];
      }
      throw e;
    }
  }

  async getFollowingsForCurrentUser({ type }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    const nodeType = await RockConstants.modelType(type);

    try {
      const currentUser = await Auth.getCurrentPerson();
      return this.request('Followings')
        .filter(
          // eslint-disable-next-line prettier/prettier
          `(EntityTypeId eq ${nodeType.id}) and (PersonAliasId eq ${currentUser.primaryAliasId})`
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
