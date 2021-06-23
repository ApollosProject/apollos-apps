import { createGlobalId } from '@apollosproject/server-core';
import { range } from 'lodash';
import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import { createModel as createPersonModel } from '../../people/model';
import {
  createModel as createFollowModel,
  setupModel as setupFollowModel,
} from '../../follows/model';
import {
  createModel as createFlagsModel,
  setupModel as setupFlagsModel,
} from '../../user-flags/model';
import {
  createModel as createLikesModel,
  setupModel as setupLikesModel,
} from '../../user-likes/model';
import CommentDataSource from '../dataSource';
import UserFlagDataSource from '../../user-flags/dataSource';
import UserLikeDataSource from '../../user-likes/dataSource';

let person1;
let person2;
let person3;
let currentPerson;
const context = {
  dataSources: {
    Person: {
      getCurrentPersonId: () => currentPerson.id,
      getFromId: (id) => ({ id }),
    },
  },
};

describe('Apollos Postgres Comments DatSource', () => {
  beforeEach(async () => {
    await createModel();
    await createFlagsModel();
    await createLikesModel();
    await createPersonModel();
    await createFollowModel();
    await setupModel();
    await setupFlagsModel();
    await setupLikesModel();
    await setupFollowModel();
    await sync({ force: true });
    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });
    person2 = await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
    });
    person3 = await sequelize.models.people.create({
      originId: '3',
      originType: 'rock',
    });
    currentPerson = person1;
  });
  afterEach(async () => {
    await sequelize.drop({});
  });

  describe('addComment', () => {
    it('should support creating new comments', async () => {
      const commentDataSource = new CommentDataSource();

      commentDataSource.initialize({ context });

      const comment = await commentDataSource.addComment({
        text: 'I am a fun comment!',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      expect(comment.text).toBe('I am a fun comment!');
      expect(comment.apollosId).toBe(`Comment:${comment.id}`);
    });

    it('should prevent creating duplicate comments', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const commentArgs = {
        text: 'I am a fun comment!',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      };

      await commentDataSource.addComment(commentArgs);

      // Make sure the error assertion is made by expecting all the assertions below
      expect.assertions(2);

      try {
        await commentDataSource.addComment(commentArgs);
      } catch (e) {
        expect(e).toBeTruthy();
      }

      const comments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
      });

      expect(comments.length).toBe(1);
    });

    it('should send notifications about your comment to your followers', async () => {
      const commentDataSource = new CommentDataSource();

      commentDataSource.initialize({ context });
      context.dataSources.Notification = { createAndSend: jest.fn() };

      await sequelize.models.follows.create({
        requestPersonId: person3.id,
        followedPersonId: person1.id,
        state: 'ACCEPTED',
      });

      await commentDataSource.addComment({
        text: 'I am a fun comment!',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      // changes with every snapshot
      delete context.dataSources.Notification.createAndSend.mock.calls[0][0]
        .personId;

      expect(
        context.dataSources.Notification.createAndSend.mock.calls
      ).toMatchSnapshot();
    });
  });

  describe('updateComment', () => {
    it('should update comment', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const comment = await commentDataSource.addComment({
        text: 'I am a fun comment!',
        visibility: 'PRIVATE',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      const updatedComment = await commentDataSource.updateComment({
        commentId: comment.apollosId,
        text: 'This comment has been updated',
        visibility: 'PUBLIC',
      });

      expect(updatedComment.text).toBe('This comment has been updated');
      expect(updatedComment.visibility).toBe('PUBLIC');
      expect(updatedComment.apollosId).toBe(comment.apollosId);
    });

    it('user can only update own comment', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const comment = await commentDataSource.addComment({
        text: 'I am a fun comment!',
        visibility: 'PRIVATE',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      // Change the user id to a different user
      currentPerson = person2;

      // Try to update the other user's comment
      const updatedComment = commentDataSource.updateComment({
        commentId: comment.apollosId,
        text: 'This comment has been updated',
        visibility: 'PUBLIC',
      });

      const unchangedComment = await commentDataSource.model.findOne({
        where: { id: comment.id },
      });

      await expect(updatedComment).rejects.toMatchSnapshot();
      expect(unchangedComment.text).toBe('I am a fun comment!');
      expect(unchangedComment.visibility).toBe('PRIVATE');
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const comment = await commentDataSource.addComment({
        text: 'I am a fun comment!',
        visibility: 'PRIVATE',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      const success = await commentDataSource.deleteComment({
        commentId: comment.apollosId,
      });

      const goneComment = await commentDataSource.model.findOne({
        where: { id: comment.id },
      });

      expect(success).toBeTruthy();
      expect(goneComment).toBeNull();
    });

    it('user can only delete own comment', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const comment = await commentDataSource.addComment({
        text: 'I am a fun comment!',
        visibility: 'PRIVATE',
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      // Change the user id to a different user
      currentPerson = person2;

      // Try to delete the other user's comment
      const success = await commentDataSource.deleteComment({
        commentId: comment.apollosId,
      });

      const stillHereComment = await commentDataSource.model.findOne({
        where: { id: comment.id },
      });

      expect(success).toBeFalsy();
      expect(stillHereComment.text).toBe('I am a fun comment!');
    });
  });

  describe('getForNode', () => {
    it('should return comments for a given node', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      // eslint-disable-next-line no-restricted-syntax
      for (const index of range(10)) {
        // eslint-disable-next-line no-await-in-loop
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

    it('should return only public comments for a given node', async () => {
      const commentDataSource = new CommentDataSource();
      // Change the user id to a different user
      currentPerson = person2;
      commentDataSource.initialize({ context });

      // eslint-disable-next-line no-restricted-syntax
      for (const index of range(10)) {
        // eslint-disable-next-line no-await-in-loop
        await commentDataSource.addComment({
          text: `I am a fun comment #${index}!`,
          parentId: createGlobalId(123, 'UniversalContentItem'),
          visibility: index % 2 === 0 ? 'PUBLIC' : 'PRIVATE', // tag every other comment as public
        });
      }
      // Go back to our original user user
      currentPerson = person1;
      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
      });
      expect(itemComments.length).toBe(5);
    });

    it('should return your private comments', async () => {
      const commentDataSource = new CommentDataSource();
      // Change the user id to a different user
      currentPerson = person2;
      commentDataSource.initialize({ context });

      // eslint-disable-next-line no-restricted-syntax
      for (const index of range(5)) {
        // eslint-disable-next-line no-await-in-loop
        await commentDataSource.addComment({
          text: `I am a fun comment #${index}!`,
          parentId: createGlobalId(123, 'UniversalContentItem'),
          visibility: 'PRIVATE', // tag each comment as private
        });
      }
      // Go back to our original user user
      currentPerson = person1;
      // eslint-disable-next-line no-restricted-syntax
      for (const index of range(5)) {
        // eslint-disable-next-line no-await-in-loop
        await commentDataSource.addComment({
          text: `I am a fun comment #${index}!`,
          parentId: createGlobalId(123, 'UniversalContentItem'),
          visibility: 'PRIVATE', // tag each comment as private
        });
      }

      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
      });
      expect(itemComments.length).toBe(5);
    });

    it('returns all comments when flagLimit is 0', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const flagDataSource = new UserFlagDataSource();
      flagDataSource.initialize({ context });

      await commentDataSource.addComment({
        text: `This is okay!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });
      const comment = await commentDataSource.addComment({
        text: `This is flagged!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      await flagDataSource.flagComment({
        commentId: `Comment:${comment.id}`,
      });

      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
      });
      expect(itemComments.length).toBe(2);
    });

    it('should only return un-flagged comments', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      const flagDataSource = new UserFlagDataSource();
      flagDataSource.initialize({ context });

      await commentDataSource.addComment({
        text: `This is okay!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });
      const comment = await commentDataSource.addComment({
        text: `This is flagged!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      await flagDataSource.flagComment({
        commentId: `Comment:${comment.id}`,
      });

      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
        flagLimit: 1,
      });
      expect(itemComments.length).toBe(1);
      expect(itemComments[0].text).toBe('This is okay!');
    });

    it('should sort your followers to the top', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });

      currentPerson = person2;
      const comment1 = await commentDataSource.addComment({
        text: `I am not followed!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person3;
      const comment2 = await commentDataSource.addComment({
        text: `I am followed! I should float to the top!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person2;
      const comment3 = await commentDataSource.addComment({
        text: `I am not followed! Back to the bottom!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person1;

      await sequelize.models.follows.create({
        requestPersonId: person1.id,
        followedPersonId: person3.id,
        state: 'ACCEPTED',
      });

      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
        flagLimit: 1,
      });
      expect(itemComments.length).toBe(3);
      expect([comment2, comment1, comment3].map(({ id }) => id)).toEqual(
        itemComments.map(({ id }) => id)
      );
    });

    it('should sort by likes', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });
      const userLikeDataSource = new UserLikeDataSource();
      userLikeDataSource.initialize({ context });

      currentPerson = person2;
      const comment1 = await commentDataSource.addComment({
        text: `I am not liked!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person3;
      const comment2 = await commentDataSource.addComment({
        text: `I am liked! I should float to the top!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person2;
      const comment3 = await commentDataSource.addComment({
        text: `I am not liked! Back to the bottom!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person1;

      await userLikeDataSource.updateLikeComment({
        commentId: comment2.apollosId,
        operation: 'Like',
      });

      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
        flagLimit: 1,
      });
      expect(itemComments.length).toBe(3);
      expect([comment2, comment1, comment3].map(({ id }) => id)).toEqual(
        itemComments.map(({ id }) => id)
      );
    });

    it('should include follows before high like counts', async () => {
      const commentDataSource = new CommentDataSource();
      commentDataSource.initialize({ context });
      const userLikeDataSource = new UserLikeDataSource();
      userLikeDataSource.initialize({ context });

      currentPerson = person2;
      const comment1 = await commentDataSource.addComment({
        text: `I am not followed nor liked!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person3;
      const comment2 = await commentDataSource.addComment({
        text: `I am followed! I should float to the top!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person2;
      const comment3 = await commentDataSource.addComment({
        text: `I am not followed, but I am liked! 2nd place for me!`,
        parentId: createGlobalId(123, 'UniversalContentItem'),
      });

      currentPerson = person1;

      await sequelize.models.follows.create({
        requestPersonId: person1.id,
        followedPersonId: person3.id,
        state: 'ACCEPTED',
      });

      await userLikeDataSource.updateLikeComment({
        commentId: comment3.apollosId,
        operation: 'Like',
      });

      const itemComments = await commentDataSource.getForNode({
        nodeId: 123,
        nodeType: 'UniversalContentItem',
        flagLimit: 1,
      });
      expect(itemComments.length).toBe(3);
      expect([comment2, comment3, comment1].map(({ id }) => id)).toEqual(
        itemComments.map(({ id }) => id)
      );
    });
  });
});
