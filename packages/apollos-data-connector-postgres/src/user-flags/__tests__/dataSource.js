import { createGlobalId } from '@apollosproject/server-core';
import { sync } from '../../postgres/index';
import { createModel } from '../model';
import { createModel as createCommentModel } from '../../comments/model';
import CommentDataSource from '../../comments/dataSource';
import UserFlagDataSource from '../dataSource';
import connect from '../../../test-connect';

let personId;

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: personId }),
    },
    Person: {
      getFromId: () => ({ id: personId }),
    },
  },
};

describe('Apollos Postgres Comment Flags DataSource', () => {
  let comment;
  let commentDataSource;
  let sequelize;

  beforeAll(async () => {
    sequelize = connect();
  });

  afterAll(async () => sequelize.close());

  beforeEach(async () => {
    personId = 1;

    await createCommentModel(sequelize);
    await createModel(sequelize);
    await sync({}, sequelize);

    commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context, sequelize });

    comment = await commentDataSource.addComment({
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });
  });
  afterEach(async () => {
    await sequelize.drop({});
  });

  it('should support flagging comment', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context, sequelize });

    const flaggedComment = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    expect(flaggedComment.id.toString()).toBe(comment.id.toString());
    expect(flaggedComment.apollosId).toBe(
      createGlobalId(comment.id, 'Comment')
    );
  });

  it('should increment flag count on comment', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context, sequelize });

    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const updatedComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    expect(updatedComments[0].flagCount).toBe(1);
  });

  it('should only increment count for new flags', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context, sequelize });

    // Try to have the same user flag a comment twice
    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });
    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const updatedComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    // Should only record one flag
    expect(updatedComments[0].flagCount).toBe(1);

    // Have another user flag it though...
    personId = 2;
    await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    // And now the count is incremented
    const updatedAgainComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    expect(updatedAgainComments[0].flagCount).toBe(2);
  });

  it('should return a user for a flag', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context, sequelize });

    const flaggedComment = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const flag = await sequelize.models.user_flags.findOne({
      nodeId: flaggedComment.apollosId,
    });

    const flagPerson = await userFlagDataSource.getPerson(flag);
    expect(flagPerson).toEqual({ id: personId });
  });
});
