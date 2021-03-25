import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';

class UserLike extends PostgresDataSource {
  modelName = 'user_likes';

  /**
   * @returns {Object} The updated comment
   */
  async updateLikeComment({ commentId, operation }) {
    const { Person } = this.context.dataSources;
    const { comments } = this.sequelize.models;

    const currentPersonId = await Person.getCurrentPersonId();
    const isLike = operation === 'Like';
    const args = { personId: currentPersonId, nodeId: commentId };
    const { id } = parseGlobalId(commentId);

    let likeCreated = false;
    let likeDeleted = false;
    if (isLike) {
      likeCreated = await this.likeNode(args);
    } else {
      likeDeleted = await this.unlikeNode(args);
    }

    // Increment only if a new like was created, decrement only if an existing one was deleted
    let comment;
    if (likeCreated) {
      [[[comment]]] = await comments.increment('likedCount', {
        where: { id },
      });
    } else if (likeDeleted) {
      [[[comment]]] = await comments.decrement('likedCount', {
        where: { id },
      });
    } else {
      comment = await comments.findOne({ where: { id }, raw: true });
    }

    return { ...comment, isLiked: isLike };
  }

  /**
   * Args for liking or unliking nodes
   * @typedef {Object} LikeArgs
   * @property {string} personId Postgres UUID of the user doing the liking
   * @property {string} nodeId Apollos globalId of the node being liked
   */

  /**
   * @param {LikeArgs} args
   * @returns {Boolean} True if a new like was recorded, false if the node was already liked by this user.
   */
  async likeNode({ personId, nodeId }) {
    const { id, __type } = parseGlobalId(nodeId);

    // Record the like unless the user has already liked this node, in which case simply ignore it.
    const [, created] = await this.model.findOrCreate({
      where: {
        nodeId: String(id),
        nodeType: __type,
        personId,
      },
    });

    return created;
  }

  /**
   * @param {LikeArgs} args
   * @returns {Boolean} True if a like was deleted, false if there was no existing like.
   */
  async unlikeNode({ personId, nodeId }) {
    const { id, __type } = parseGlobalId(nodeId);

    // Record the like unless the user has already liked this node, in which case simply ignore it.
    const numDeleted = await this.model.destroy({
      where: {
        nodeId: String(id),
        nodeType: __type,
        personId,
      },
    });

    return numDeleted > 0;
  }

  /**
   * @param {Object} args
   * @param {string} nodeId Apollos globalId of the node being liked
   * @param {string} [personId] Optional. Postgres UUID of the user to check. If omitted, the current user is checked.
   */
  async userLikedNode({ nodeId, personId = null }) {
    let currentPersonId = personId;
    const { id, __type } = parseGlobalId(nodeId);
    const { Person } = this.context.dataSources;

    if (personId === null) {
      currentPersonId = await Person.getCurrentPersonId();
    }

    const existingLike = await this.model.findOne({
      where: {
        nodeId: String(id),
        nodeType: __type,
        personId: currentPersonId,
      },
    });

    return !!existingLike;
  }
}

export { UserLike as default };
