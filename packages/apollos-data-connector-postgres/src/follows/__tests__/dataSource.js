import { parseGlobalId } from '@apollosproject/server-core';
import { range } from 'lodash';
import { sequelize, sync } from '../../postgres/index';
import { createModel, setupModel, FollowState } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import PeopleDataSource from '../../people/dataSource';
import FollowDataSource from '../dataSource';

const uuids = [
  '015e6676-1689-43ca-8a99-3abb88b8bb7d',
  '285fcac9-1de5-47df-9e12-02d8fdb4096e',
  'c8c065c0-03ba-4287-bd10-068f5f106757',
  '37aef563-1271-41a7-850c-2f0aa4dd3fbb',
  'd9ee01c6-c9c0-4752-9818-2a490146dcaa',
];

const getPersonId = (id) => `Person:${uuids[id - 1]}`;

let currentPersonId = 1;

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: currentPersonId }),
    },
    Person: {
      resolveId: (id) => uuids[id - 1],
    },
  },
};

describe('Apollos Postgres FollowRequest DataSource', () => {
  beforeEach(async () => {
    try {
      await createPeopleModel();
      await createModel();
      await setupModel();
      await sync({ force: true });

      // Make sure people exist for all of our test ids
      const peopleDataSource = new PeopleDataSource();
      peopleDataSource.initialize({ context });
      await Promise.all(
        uuids.map((u, i) =>
          peopleDataSource.create({
            id: u,
            originId: `${i}`,
            originType: 'rock',
          })
        )
      );
    } catch (e) {
      console.error(e);
    }
  });
  afterEach(async () => {
    await sequelize.drop({});
    currentPersonId = 1;
  });

  it('should create new follow request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore existing unaccepted request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    // Send another request
    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    // Find and deny the request
    let existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    currentPersonId = 2;

    const ignoreResult = await followDataSource.ignoreFollowRequest({
      requestPersonId: getPersonId(1),
    });

    existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.DECLINED);
    expect(existingRequest.id).toBe(ignoreResult.followId);
  });

  it('should accept request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    // Find and accept the request
    let existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    currentPersonId = 2;

    const acceptResult = await followDataSource.acceptFollowRequest({
      requestPersonId: getPersonId(1),
    });

    existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.ACCEPTED);
    expect(existingRequest.id).toBe(acceptResult.followId);
  });

  it('should ignore existing accepted request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    // Find and accept the request
    await followDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    currentPersonId = 2;

    await followDataSource.acceptFollowRequest({
      requestPersonId: getPersonId(1),
    });

    currentPersonId = 1;

    // Send another request
    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.ACCEPTED);
  });

  it('should reset existing denied request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    // Find and deny the request
    await followDataSource.model.findOne({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    currentPersonId = 2;

    await followDataSource.ignoreFollowRequest({
      requestPersonId: getPersonId(1),
    });

    currentPersonId = 1;

    // Send another request
    await followDataSource.requestFollow({
      followedPersonId: getPersonId(2),
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: parseGlobalId(getPersonId(2)).id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should return list of users requesting to follow the current user', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    // Have several people follow user 1
    const followRange = range(2, uuids.length + 1);
    await Promise.all(
      followRange.map((id) => {
        currentPersonId = id;
        return followDataSource.requestFollow({
          followedPersonId: getPersonId(1),
        });
      })
    );

    currentPersonId = 1;

    const follows = await followDataSource.followRequests();

    expect(follows.length).toBe(followRange.length);
    expect(follows.map((f) => f.id).includes(uuids[0])).toBeFalsy();
  });

  it('should only return unanswered requests', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    // Have several people follow user 1
    const followRange = range(2, uuids.length + 1);
    await Promise.all(
      followRange.map((id) => {
        currentPersonId = id;
        return followDataSource.requestFollow({
          followedPersonId: getPersonId(1),
        });
      })
    );

    currentPersonId = 1;

    // accept one of the requests
    await followDataSource.acceptFollowRequest({
      requestPersonId: getPersonId(2),
    });

    const follows = await followDataSource.followRequests();

    // Should be one fewer request
    expect(follows.length).toBe(followRange.length - 1);
  });
});
