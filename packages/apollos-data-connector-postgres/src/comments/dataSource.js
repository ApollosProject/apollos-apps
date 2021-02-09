import { Op } from 'sequelize';
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
        externalParentId: String(id),
        externalParentType: __type,
        externalParentSource: 'rock',
        externalPersonId: String(currentUser.id),
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

  async getForNode({ nodeId, nodeType, flagLimit = 0 }) {
    const where = {
      externalParentId: String(nodeId),
      externalParentType: nodeType,
    };

    if (flagLimit > 0) {
      where.flagCount = { [Op.lt]: flagLimit };
    }

    const comments = await this.sequelize.models.comments.findAll({ where });

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
