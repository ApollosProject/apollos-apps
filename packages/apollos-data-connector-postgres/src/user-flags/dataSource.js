import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';

class UserFlagDataSource extends PostgresDataSource {
  modelName = 'user_flags';

  async flagComment({ commentId }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();

    const { id, __type } = parseGlobalId(commentId);

    // Record the flag unless the user has already flagged this comment, in which case simply ignore it.
    const [, created] = await this.model.findOrCreate({
      where: {
        nodeId: String(id),
        nodeType: __type,
        personId: currentPersonId,
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
}

export { UserFlagDataSource as default };
