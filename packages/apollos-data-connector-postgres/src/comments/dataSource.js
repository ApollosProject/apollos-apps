import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';

class CommentDataSource extends PostgresDataSource {
  modelName = 'comments';

  async addComment({ text, featureId }) {
    const currentUser = await this.context.dataSources.Auth.getCurrentPerson();

    const { id } = parseGlobalId(featureId);
    const { nodeId, nodeType } = JSON.parse(id);

    const ret = await this.sequelize.transaction(async (t) => {
      const comment = await this.model.create(
        {
          text,
        },
        { transaction: t }
      );

      await this.sequelize.models.comment_relationships.create(
        {
          externalId: currentUser.id,
          externalSource: 'rock',
          relationshipType: 'person',
          commentId: comment.id,
        },
        { transaction: t }
      );

      await this.sequelize.models.comment_relationships.create(
        {
          externalId: nodeId,
          externalSource: 'rock',
          relationshipType: 'parent',
          commentId: comment.id,
        },
        { transaction: t }
      );

      return comment;
    });

    return ret;
  }

  async getForNode({ nodeId }) {
    const commentRelationships = await this.sequelize.models.comment_relationships.findAll(
      {
        where: { externalId: nodeId, relationshipType: 'parent' },
        include: this.sequelize.models.comments,
      }
    );

    return commentRelationships.map(({ comment }) => comment);
  }

  async getPerson({ id }) {
    const personRelationship = await this.sequelize.models.comment_relationships.findOne(
      {
        where: { commentId: id, relationshipType: 'person' },
      }
    );

    return this.context.dataSources.Person.getFromId(
      personRelationship.externalId
    );
  }
}

export { CommentDataSource as default };
