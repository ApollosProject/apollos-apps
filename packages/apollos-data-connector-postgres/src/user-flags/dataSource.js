import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';

class UserFlagDataSource extends PostgresDataSource {
  modelName = 'user_flags';

  async flagComment({ commentId }) {
    const currentUser = await this.context.dataSources.Auth.getCurrentPerson();

    const { id, __type } = parseGlobalId(commentId);

    // Record the flag unless the user has already flagged this comment, in which case simply ignore it.
    const [, created] = await this.model.findOrCreate({
      where: {
        nodeId: String(id),
        nodeType: __type,
        externalPersonId: String(currentUser.id),
      },
    });

    if (created) {
      await this.sequelize.models.comments.increment('flagCount', {
        where: { id },
      });
    }

    const comment = this.sequelize.models.comments.findOne({
      where: { id },
    });

    return comment;
  }

  async getPerson({ id }) {
    const flag = await this.sequelize.models.user_flags.findOne({
      where: { id },
    });

    return this.context.dataSources.Person.getFromId(flag.externalPersonId);
  }
}

export { UserFlagDataSource as default };
