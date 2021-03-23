import { createGlobalId } from '@apollosproject/server-core';
import { unset } from 'lodash';
import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import {
  createModel as createCommentModel,
  setupModel as setupCommentModel,
} from '../../comments/model';
import { createModel as createPeopleModel } from '../../people/model';
import { createModel as createFollowModel } from '../../follows/model';
import CommentDataSource from '../../comments/dataSource';
import UserLike from '../dataSource';

let person1;
let person2;
let currentPerson;
const context = {
  dataSources: {
    Person: {
      getCurrentPersonId: () => currentPerson.id,
    },
  },
};

describe('Apollos Postgres User Likes DataSource', () => {
  let comment;
  let commentDataSource;

  beforeEach(async () => {
    await createCommentModel();
    await createPeopleModel();
    await createFollowModel();
    await createModel();
    await setupModel();
    await setupCommentModel();
    await sync();

    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });
    person2 = await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
    });
    currentPerson = person1;

    commentDataSource = new CommentDataSource();
    commentDataSource.initialize({ context });

    comment = await commentDataSource.addComment({
      text: 'I am a fun comment!',
      parentId: createGlobalId(123, 'UniversalContentItem'),
    });
  });

  afterEach(async () => {
    await sequelize.drop({});
  });

  it.only('should support liking comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const likedComment = await userLikeDataSource.likeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    expect(likedComment).toBeTruthy();
  });

  it.only('should return false if comment already liked', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    await userLikeDataSource.likeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    const likedComment = await userLikeDataSource.likeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    expect(likedComment).toBeFalsy();
  });

  it.only('should support unliking comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    // Like a comment first so we can unlike it
    await userLikeDataSource.likeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    const unlikedComment = await userLikeDataSource.unlikeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    expect(unlikedComment).toBeTruthy();
  });

  it.only('should return false if comment not liked', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const unlikedComment = await userLikeDataSource.unlikeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    expect(unlikedComment).toBeFalsy();
  });

  it.only('should like comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const likedComment = await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    expect(likedComment.isLiked).toBeTruthy();
  });

  // should unlike comment

  // should only increase likedCount when a new like is added

  // should only decrease likedCount when a like is removed

  // From copy paste --- TODO: DELETE

  it('should increment flag count on comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    await userLikeDataSource.likeNode({
      commentId: comment.apollosId,
    });

    const updatedComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    expect(updatedComments[0].flagCount).toBe(1);
  });

  it('should only increment count for new flags', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    // Try to have the same user flag a comment twice
    await userLikeDataSource.likeNode({
      commentId: comment.apollosId,
    });
    await userLikeDataSource.likeNode({
      commentId: comment.apollosId,
    });

    const updatedComments = await commentDataSource.getForNode({
      nodeId: 123,
      nodeType: 'UniversalContentItem',
    });

    // Should only record one flag
    expect(updatedComments[0].flagCount).toBe(1);

    // Have another user flag it though...
    currentPerson = person2;
    await userLikeDataSource.likeNode({
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
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const likedComment = await userLikeDataSource.likeNode({
      commentId: comment.apollosId,
    });

    const flag = await sequelize.models.user_flags.findOne({
      nodeId: likedComment.apollosId,
    });

    const flagPerson = await sequelize.models.people.findByPk(flag.personId);
    expect(flagPerson.id).toEqual(currentPerson.id);
  });
});
