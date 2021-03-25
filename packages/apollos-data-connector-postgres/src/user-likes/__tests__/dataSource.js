import { createGlobalId } from '@apollosproject/server-core';
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

  it('should support liking comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const likedComment = await userLikeDataSource.likeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    expect(likedComment).toBeTruthy();
  });

  it('should return false if comment already liked', async () => {
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

  it('should support unliking comment', async () => {
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

  it('should return false if comment not liked', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const unlikedComment = await userLikeDataSource.unlikeNode({
      nodeId: comment.apollosId,
      personId: person1.id,
    });

    expect(unlikedComment).toBeFalsy();
  });

  it('should like comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    const isLiked = await userLikeDataSource.userLikedNode({
      nodeId: comment.apollosId,
    });

    expect(isLiked).toBeTruthy();
  });

  it('should unlike comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Unlike',
    });

    const isLiked = await userLikeDataSource.userLikedNode({
      nodeId: comment.apollosId,
    });

    expect(isLiked).toBeFalsy();
  });

  it('should only increase likedCount when a new like is added', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    // Like as a different person
    currentPerson = person2;
    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    // Try to like again as the original person
    currentPerson = person1;
    const likedComment = await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    expect(likedComment.likedCount).toBe(2);
  });

  it('should only decrease likedCount when a like is removed', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    // Add like as person1
    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    // Add like as person2
    currentPerson = person2;
    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    // Unlike with person 2
    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Unlike',
    });

    // Unlike with person 2 again
    const unlikedComment = await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Unlike',
    });

    expect(unlikedComment.likedCount).toBe(1);
  });

  it('should return true if the user has liked the comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    const before = await userLikeDataSource.userLikedNode({
      nodeId: comment.apollosId,
    });

    expect(before).toBeFalsy();

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    const after = await userLikeDataSource.userLikedNode({
      nodeId: comment.apollosId,
    });

    expect(after).toBeTruthy();
  });

  it('should return false if the user has unliked the comment', async () => {
    const userLikeDataSource = new UserLike();
    userLikeDataSource.initialize({ context });

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Like',
    });

    await userLikeDataSource.updateLikeComment({
      commentId: comment.apollosId,
      operation: 'Unike',
    });

    const after = await userLikeDataSource.userLikedNode({
      nodeId: comment.apollosId,
    });

    expect(after).toBeFalsy();
  });
});
