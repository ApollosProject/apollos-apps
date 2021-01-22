import { createGlobalId } from '@apollosproject/server-core';
import { sequelize, sync } from '../../postgres/index';
import { createModel } from '../model';
import { createModel as createCommentModel } from '../../comments/model';
import CommentDataSource from '../../comments/dataSource';
import UserFlagDataSource from '../dataSource';

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

  beforeEach(async () => {
    personId = 1;

    await createCommentModel();
    await createModel();
    await sync();

    commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    comment = await commentDataSource.addComment({
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });
  });
  afterEach(async () => {
    await sequelize.dropAllSchemas();
  });

  it('should support flagging comment', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

    const flag = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    expect(flag.commentId).toBe(comment.id.toString());
    expect(flag.apollosId).toBe(createGlobalId(flag.id, 'UserFlag'));
  });

  it('should increment flag count on comment', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

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
    userFlagDataSource.initialize({ context });

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
    userFlagDataSource.initialize({ context });

    const flag = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });

    const flagPerson = await userFlagDataSource.getPerson(flag);
    expect(flagPerson).toEqual({ id: personId });
  });

  it('should return a comment for a flag', async () => {
    const userFlagDataSource = new UserFlagDataSource();
    userFlagDataSource.initialize({ context });

    const flag = await userFlagDataSource.flagComment({
      commentId: comment.apollosId,
    });
    const flagComment = await userFlagDataSource.getComment(flag);

    expect(flagComment).toEqual(expect.objectContaining({ id: comment.id }));
  });
});
