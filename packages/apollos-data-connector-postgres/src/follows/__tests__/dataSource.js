import { parseGlobalId } from '@apollosproject/server-core';
import { sequelize, sync } from '../../postgres/index';
import { createModel, FollowState } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import FollowDataSource from '../dataSource';

// Current user by default
const uuid1 = '82182626-4331-4506-a87b-490cb9ffae2e';
const personId1 = `Person:${uuid1}`;

// Followed user by default
const uuid2 = '70bfd529-cbf0-4fdf-b6e6-415278d3f5cb';
const PersonId2 = `Person:${uuid2}`;

let currentPersonId = 1;

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: currentPersonId }),
    },
    Person: {
      resolveId: (id) => (id === 1 ? uuid1 : uuid2),
    },
  },
};

describe('Apollos Postgres FollowRequest DataSource', () => {
  beforeEach(async () => {
    try {
      await createModel();
      await createPeopleModel();
      await sync({ force: true });
    } catch (e) {
      console.error(e);
    }
  });
  afterEach(async () => {
    await sequelize.drop({});
    currentPersonId = 1;
  });

  it('should create new follow request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore existing unaccepted request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    // Send another request
    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    // Find and deny the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    currentPersonId = 2;

    const ignoreResult = await requestFollowDataSource.ignoreFollowRequest({
      requestPersonId: personId1,
    });

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.DECLINED);
    expect(existingRequest.id).toBe(ignoreResult.followId);
  });

  it('should accept request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    // Find and accept the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    currentPersonId = 2;

    const acceptResult = await requestFollowDataSource.acceptFollowRequest({
      requestPersonId: personId1,
    });

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.ACCEPTED);
    expect(existingRequest.id).toBe(acceptResult.followId);
  });

  it('should ignore existing accepted request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    // Find and accept the request
    await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    currentPersonId = 2;

    await requestFollowDataSource.acceptFollowRequest({
      requestPersonId: personId1,
    });

    currentPersonId = 1;

    // Send another request
    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.ACCEPTED);
  });

  it('should reset existing denied request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    // Find and deny the request
    await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    currentPersonId = 2;

    await requestFollowDataSource.ignoreFollowRequest({
      requestPersonId: personId1,
    });

    currentPersonId = 1;

    // Send another request
    await requestFollowDataSource.requestFollow({
      followedPersonId: PersonId2,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(PersonId2).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });
});
