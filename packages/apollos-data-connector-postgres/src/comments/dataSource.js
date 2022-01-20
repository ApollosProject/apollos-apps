import { Op } from 'sequelize';
import { parseGlobalId, generateAppLink } from '@apollosproject/server-core';
import { PostgresDataSource, isUuid } from '../postgres';
import { Visibility } from './model';

class CommentDataSource extends PostgresDataSource {
  modelName = 'comments';

  async addComment({
    text,
    parentId,
    visibility = Visibility.PUBLIC,
    sendNotificationsSync = false,
  }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();

    // eslint-disable-next-line prefer-const
    let { id, __type } = parseGlobalId(parentId);

    if (isUuid(id)) {
      // we have a postgres id.
      const item = await this.context.dataSources.ContentItem.getFromId(id);
      id = item.originId;
    }

    const [comment, created] = await this.model.findOrCreate({
      where: {
        text,
        externalParentId: String(id),
        externalParentType: __type,
        externalParentSource: 'rock',
        personId: currentPersonId,
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

    if (visibility === Visibility.PUBLIC) {
      const sendingNotifications = this.sendNotificationForComment({
        comment,
        parentId,
      });
      if (sendNotificationsSync) {
        // mostly used in the test environment.
        // waits to send notfications before returning comment
        await sendingNotifications;
      }
    }

    return comment;
  }

  async sendNotificationForComment({ comment, parentId }) {
    const commentCreator = await comment.getPerson();

    const followers = await commentCreator.getFollowers();
    const url = generateAppLink(
      'deep',
      'content',
      {
        contentID: parentId,
      },
      this.context.dataSources.Config
    );

    await Promise.all(
      followers.map(async (person) =>
        this.context.dataSources.Notification.createAndSend({
          title: "New journal from someone you're following",
          body: `${commentCreator.firstName} ${commentCreator.lastName} has just done a bit of journaling. Check it out!`,
          personId: person.id,
          type: 'COMMENT',
          data: {
            data: {
              url,
            },
          },
        })
      )
    );
  }

  async updateComment({ commentId, text, visibility }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();

    const { id } = parseGlobalId(commentId);

    const [count, results] = await this.model.update(
      {
        text,
        visibility,
      },
      {
        where: {
          id,
          personId: currentPersonId,
        },
        returning: true,
      }
    );

    if (count < 1) {
      throw new Error('Unable to update comment');
    }

    return results[0];
  }

  async deleteComment({ commentId }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();

    const { id } = parseGlobalId(commentId);

    const count = await this.model.destroy({
      where: {
        id,
        personId: currentPersonId,
      },
    });

    return count > 0;
  }

  async getForNode({ nodeId, nodeType, parentId, parentType, flagLimit = 0 }) {
    let currentPersonId;
    try {
      currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    } catch (e) {
      // no user signed in, that's fine. We'll just return an empty array.
      return [];
    }

    // select comments.*, follows.id as follow_id from comments left join follows on follows."followedPersonId" = comments."personId" and follows."requestPersonId" = '05c032d6-94a9-4e43-89c6-aa777f68d682' and follows.state = 'ACCEPTED' order by follow_id nulls last;

    const where = {
      [Op.or]: [
        { visibility: Visibility.PUBLIC }, // Show public journals
        {
          personId: currentPersonId,
        },
      ],
    };

    if (nodeId && nodeType) {
      where.externalParentId = String(nodeId);
      where.externalParentType = nodeType;
    } else if (parentId && parentType) {
      // todo - we should start storing this data on the comment model itself.
      if (parentType === 'ContentItem') {
        const contentItem = await this.context.dataSources.ContentItem.getFromId(
          parentId
        );
        where.externalParentId = contentItem.originId;
        where.externalParentType = contentItem.apollosType;
      }
    }

    if (flagLimit > 0) {
      where.flagCount = { [Op.lt]: flagLimit };
    }

    // eslint-disable-next-line camelcase
    const { comments, follows, people, user_likes } = this.sequelize.models;

    return comments.findAll({
      where,
      include: [
        // we join in the follows table to sort your followers to the top
        {
          model: follows,
          where: {
            requestPersonId: currentPersonId, // we look for people who you follows
            state: 'ACCEPTED', // and make sure they are accepted
          },
          required: false, // emulates a left outer join
        },
        {
          model: people,
        },
        {
          model: user_likes,
          where: {
            personId: currentPersonId,
          },
          required: false, // emulates a left outer join
        },
      ],
      order: [
        [follows, 'id', 'desc', 'nulls last'], // and sort null (no relationship) values to the bottom
        ['likedCount', 'desc'],
      ],
    });
  }
}

export { CommentDataSource as default };
