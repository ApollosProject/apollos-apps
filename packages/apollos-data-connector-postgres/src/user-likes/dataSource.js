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

    let comment = await comments.findOne({
      where: { id },
    });

    if (isLike) {
      if (await this.likeNode(args)) {
        // Only increment when a new like is added
        comment = await comment.increment('likedCount');
      }
    } else if (await this.unlikeNode(args)) {
      // Only decrement when an existing like is deleted
      comment = await comment.decrement('likedCount');
    }

    return comment;
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
  async userLikedNode({ nodeId, personId = null, ...node }) {
    let currentPersonId = personId;
    const { id, __type } = parseGlobalId(nodeId);
    const { Person } = this.context.dataSources;

    if (personId === null) {
      currentPersonId = await Person.getCurrentPersonId();
    }

    // For models that have a eager loaded their user_likes relationship.
    // Pull the correct userLike
    if (node.user_likes && Array.isArray(node.user_likes)) {
      return node.user_likes.some((like) => like.personId === currentPersonId);
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
