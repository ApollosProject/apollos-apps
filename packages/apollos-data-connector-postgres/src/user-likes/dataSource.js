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
    const args = { personId: currentPersonId, commentId };
    const { id } = parseGlobalId(commentId);

    let likedCountChange;
    if (isLike) {
      const likeCreated = this.likeNode(args);
      likedCountChange = likeCreated ? 1 : 0;
    } else {
      const likeDeleted = this.unlikeNode(args);
      likedCountChange = likeDeleted ? -1 : 0;
    }

    // Based on how that went, update the total likes count
    let updateCount;
    if (likedCountChange > 0) {
      updateCount = comments.increment;
    } else if (likedCountChange < 0) {
      updateCount = comments.decrement;
    }

    const comment = await updateCount('likedCount', {
      where: { id },
      by: Math.abs(likedCountChange),
    });

    return comment;
  }

  /**
   * Args for liking or unliking nodes
   * @typedef {Object} LikeArgs
   * @property {string} args.personId Postgres UUID of the user doing the liking
   * @property {string} args.nodeId Apollos globalId of the node being liked
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
}

export { UserLike as default };
