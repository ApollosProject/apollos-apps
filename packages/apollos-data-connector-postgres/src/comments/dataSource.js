import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';
import { Visibility } from './model';

class CommentDataSource extends PostgresDataSource {
  modelName = 'comments';

  async addComment({ text, parentId, visibility = Visibility.PRIVATE }) {
    const currentUser = await this.context.dataSources.Auth.getCurrentPerson();

    const { id, __type } = parseGlobalId(parentId);

    const [comment, created] = await this.model.findOrCreate({
      where: {
        text,
        externalParentId: id,
        externalParentType: __type,
        externalParentSource: 'rock',
        externalPersonId: currentUser.id,
      },
      defaults: {
        visibility,
      },
    });

    if (!created) {
      throw new Error(
        'Unable to save comment, a duplicate comment already exists'
      );
    }

    return comment;
  }

  async getForNode({ nodeId, nodeType }) {
    const comments = await this.sequelize.models.comments.findAll({
      where: { externalParentId: nodeId, externalParentType: nodeType },
    });

    return comments;
  }

  async getPerson({ id }) {
    const comment = await this.sequelize.models.comments.findOne({
      where: { id },
    });

    return this.context.dataSources.Person.getFromId(comment.externalPersonId);
  }
}

export { CommentDataSource as default };
