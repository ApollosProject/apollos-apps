import { createGlobalId } from '@apollosproject/server-core';
import { range } from 'lodash';
import { sequelize, sync } from '../../postgres/index';
import { createModel } from '../model';
import CommentDataSource from '../dataSource';

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: 1 }),
    },
    Person: {
      getFromId: () => ({ id: 1 }),
    },
  },
};

describe('Apollos Postgres Comments DatSource', () => {
  beforeEach(async () => {
    await createModel();
    await sync();
  });
  afterEach(async () => {
    await sequelize.dropAllSchemas();
  });
  it('should support creating new comments', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    const comment = await commentDataSource.addComment({
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    expect(comment.text).toBe('I am a fun comment!');
    expect(comment.apollosId).toBe(createGlobalId(comment.id, 'Comment'));
  });

  it('should return comments for a given node', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    for (const index of range(10)) {
      await commentDataSource.addComment({
        text: `I am a fun comment #${index}!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });
    }

    const itemComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });
    expect(itemComments.length).toBe(10);
  });

  it('should return a user for a comment', async () => {
    const commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    const comment = await commentDataSource.addComment({
      text: `I am a fun comment!`,
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });

    const commentPerson = await commentDataSource.getPerson(comment);
    expect(commentPerson).toEqual({ id: 1 });
  });
});
