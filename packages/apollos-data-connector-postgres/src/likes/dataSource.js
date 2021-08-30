import sequelize from 'sequelize';
import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';

export default class Followings extends PostgresDataSource {
  resource = 'Followings';

  sumLikedByAction = `SUM(
      CASE action
        WHEN 'LIKE' THEN 1
        WHEN  'UNLIKE' THEN -1
        ELSE 0
      END
    )`;

  async updateLikeNode({ nodeId, operation, resolveInfo }) {
    const {
      dataSources,
      models: { Node },
    } = this.context;

    const isLiked = await this.getIsLikedForCurrentUserAndNode({ nodeId });

    if (operation === 'Like' && !isLiked) {
      await this.likeNode({ nodeId });
    } else if (isLiked) {
      await this.unLikeNode({ nodeId });
    }
    const item = await Node.get(nodeId, dataSources, resolveInfo);
    item.isLiked = operation === 'Like';
    return item;
  }

  async likeNode({ nodeId }) {
    const {
      dataSources: { Interactions },
    } = this.context;

    await Interactions.createNodeInteraction({ nodeId, action: 'LIKE' });
  }

  async unLikeNode({ nodeId }) {
    const {
      dataSources: { Interactions },
    } = this.context;

    await Interactions.createNodeInteraction({ nodeId, action: 'UNLIKE' });
  }

  async getLikesCountByNodeId({ nodeId }) {
    const { id } = parseGlobalId(nodeId);

    const result = await this.sequelize.models.interaction.findOne({
      attributes: [[sequelize.literal(this.sumLikedByAction), 'sum'], 'nodeId'],
      where: {
        nodeId: id,
      },
      group: ['nodeId'],
    });
    const sum = result?.get({ plain: true })?.sum || '0';
    return parseInt(sum, 10);
  }

  async getIsLikedForCurrentUserAndNode({ nodeId }) {
    const {
      dataSources: { Person },
    } = this.context;

    const personId = await Person.getCurrentPersonId();

    const { id } = parseGlobalId(nodeId);
    const result = await this.sequelize.models.interaction.findOne({
      attributes: [[sequelize.literal(this.sumLikedByAction), 'sum'], 'nodeId'],
      where: {
        nodeId: id,
        personId,
      },
      group: ['nodeId'],
    });
    const sum = result?.get({ plain: true })?.sum || '0';
    return parseInt(sum, 10) > 0;
  }

  async getForCurrentUser({ offset, limit }) {
    const {
      dataSources: { Person },
    } = this.context;

    const personId = await Person.getCurrentPersonId();

    const likedItems = await this.sequelize.query(
      `
        SELECT * FROM content_item INNER JOIN
          (SELECT
            node_id,
            node_type,
            ${this.sumLikedByAction}
          AS like_count
          FROM interaction
          WHERE person_id = ?
          GROUP BY node_id, node_type
          )
        AS l ON l.node_id = content_item.id AND l.like_count > 0
        LIMIT ?
        OFFSET ?
      `,
      {
        replacements: [personId, limit, offset],
        model: this.sequelize.models.contentItem,
        mapToModel: true,
      }
    );
    return likedItems;
  }
}
