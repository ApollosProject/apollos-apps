import { AuthenticationError } from 'apollo-server';
import { parseGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class Followings extends RockApolloDataSource {
  resource = 'Followings';

  async updateLikeNode({ nodeId, operation, resolveInfo }) {
    const {
      dataSources,
      models: { Node },
    } = this.context;
    if (operation === 'Like') {
      await this.followNode({ nodeId });
    } else {
      await this.unFollowNode({ nodeId });
    }
    const item = await Node.get(nodeId, dataSources, resolveInfo);
    return { ...item, isLiked: operation === 'Like' };
  }

  updateLikeContentItem = this.updateLikeNode.bind(this);

  async followNode({ nodeId }) {
    const {
      dataSources: { RockConstants, Auth, Cache },
    } = this.context;
    const { id, __type } = parseGlobalId(nodeId);

    const currentUser = await Auth.getCurrentPerson();
    const nodeType = await RockConstants.modelType(__type);

    const followingsId = await this.post('/Followings', {
      PersonAliasId: currentUser.primaryAliasId,
      EntityTypeId: nodeType.id,
      EntityId: id,
    });

    await Cache.set({
      key: ['userLiked', currentUser.id, nodeType.id, id],
      data: true,
    });

    await Cache.increment({
      key: ['likedCount', nodeType.id, id],
    });

    return this.get(`/Followings/${followingsId}`);
  }

  async unFollowNode({ nodeId }) {
    const {
      dataSources: { RockConstants, Auth, Cache },
    } = this.context;

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);
    const currentUser = await Auth.getCurrentPerson();
    // currentUser.id is correct, this path does not use aliasId

    await Cache.set({
      key: ['userLiked', currentUser.id, nodeType.id, id],
      data: false,
    });

    await Cache.decrement({
      key: ['likedCount', nodeType.id, id],
    });

    return this.delete(`/Followings/${nodeType.id}/${id}/${currentUser.id}`);
  }

  async getFollowingsCountByNodeId({ nodeId }) {
    const {
      dataSources: { RockConstants, Cache },
    } = this.context;

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);

    const cachedCount = await Cache.get({
      key: ['likedCount', nodeType.id, id],
    });

    if (cachedCount != null) return cachedCount;

    const count = (await this.request('Followings')
      .filter(
        // eslint-disable-next-line prettier/prettier
          `(EntityId eq ${id}) and (EntityTypeId eq ${nodeType.id})`
      )
      .select('Id') // $count not supported, next best thing to make efficient
      .cache({ ttl: 1800 }) // TODO: whats the right way to do this?
      .get()).length;

    await Cache.set({
      key: ['likedCount', nodeType.id, id],
      data: count,
    });

    return count;
  }

  async getFollowingsForCurrentUserAndNode({ nodeId }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    let currentUser;
    try {
      currentUser = await Auth.getCurrentPerson();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return [];
      }
      throw e;
    }

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);

    return this.request('Followings')
      .filter(
        // eslint-disable-next-line prettier/prettier
          `(EntityId eq ${id}) and (EntityTypeId eq ${nodeType.id}) and (PersonAliasId eq ${currentUser.primaryAliasId})`
      )
      .get();
  }

  async getIsLikedForCurrentUserAndNode({ nodeId, isLiked }) {
    const {
      dataSources: { Cache, Auth, RockConstants },
    } = this.context;

    // Use preloaded value if it's already available.
    if (isLiked != null) return isLiked;

    let currentUser;
    try {
      currentUser = await Auth.getCurrentPerson();
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return false;
      }
      throw e;
    }

    const { id, __type } = parseGlobalId(nodeId);
    const nodeType = await RockConstants.modelType(__type);

    const cachedIsFollowing = await Cache.get({
      key: ['userLiked', currentUser.id, nodeType.id, id],
    });

    if (cachedIsFollowing != null) return cachedIsFollowing;

    const followings = await this.getFollowingsForCurrentUserAndNode({
      nodeId,
    });

    const userLikedNode = followings.length > 0;

    await Cache.set({
      key: ['userLiked', currentUser.id, nodeType.id, id],
      data: userLikedNode,
    });

    return userLikedNode;
  }

  async paginatedGetFollowingsForCurrentUser({ type, after, first = 20 }) {
    const {
      dataSources: { Auth },
    } = this.context;
    try {
      await Auth.getCurrentPerson();

      return this.paginate({
        cursor: await this.getFollowingsForCurrentUser({ type }),
        args: { after, first },
      });
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return { edges: [] };
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
          `(EntityTypeId eq ${nodeType.id}) and (PersonAliasId eq ${
            currentUser.primaryAliasId
          })`
        )
        .orderBy('CreatedDateTime', 'desc');
    } catch (e) {
      if (e instanceof AuthenticationError) {
        return this.request.empty();
      }
      throw e;
    }
  }
}
