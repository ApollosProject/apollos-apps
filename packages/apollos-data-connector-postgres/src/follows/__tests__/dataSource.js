import ApollosConfig from '@apollosproject/config';
import { sequelize, sync } from '../../postgres/index';
import { createModel, FollowState, setupModel } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import {
  createModel as createCampusModel,
  setupModel as setupCampusModel,
} from '../../campus/model';
import FollowDataSource from '../dataSource';

let currentPersonId = 1;

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({
        id: currentPersonId,
      }),
    },
    Person: {
      whereCurrentPerson: () => ({
        id: currentPersonId,
      }),
    },
  },
};

let person1;
let person2;
describe('Apollos Postgres FollowRequest DataSource', () => {
  let followDataSource;
  beforeEach(async () => {
    try {
      await createModel();
      await createPeopleModel();
      await createCampusModel();
      await setupModel();
      await setupCampusModel();
      await sync({ force: true });
      followDataSource = new FollowDataSource();
      followDataSource.initialize({ context });
    } catch (e) {
      console.error(e);
    }
    person1 = await sequelize.models.people.create({
      originId: '11',
      originType: 'rock',
    });
    person2 = await sequelize.models.people.create({
      originId: '22',
      originType: 'rock',
    });
    currentPersonId = person1.id;
  });
  afterEach(async () => {
    await sequelize.drop({});
    currentPersonId = 1;
  });

  it('should create new follow request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore existing unaccepted request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Send another request
    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and deny the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    const ignoreResult = await requestFollowDataSource.ignoreFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.DECLINED);
    expect(existingRequest.id).toBe(ignoreResult.id);
  });

  it('should accept request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and accept the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    const acceptResult = await requestFollowDataSource.acceptFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.ACCEPTED);
    expect(existingRequest.id).toBe(acceptResult.id);
  });

  it('should ignore existing accepted request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and accept the request
    await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    await requestFollowDataSource.acceptFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    currentPersonId = person1.id;

    // Send another request
    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.ACCEPTED);
  });

  it('should reset existing denied request', async () => {
    const requestFollowDataSource = new FollowDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and deny the request
    await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    await requestFollowDataSource.ignoreFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    currentPersonId = person1.id;

    // Send another request
    await requestFollowDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it("should get a user's list of sugggested people to follow", async () => {
    // Lengthy setup :g
    const mainCampus = await sequelize.models.campus.create({
      name: 'Main Campus',
      originId: '1',
      originType: 'rock',
    });
    const satCampus = await sequelize.models.campus.create({
      name: 'Satilite Campus',
      originId: '2',
      originType: 'rock',
    });
    await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Jim',
      lastName: 'Bob',
      email: 'jim@bob.com',
      campusId: satCampus.id,
    });
    await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      email: 'vin@wil.com',
      campusId: mainCampus.id,
    });
    await sequelize.models.people.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Nick',
      lastName: 'Offerman',
      email: 'nick@offer.man',
    });
    ApollosConfig.loadJs({
      SUGGESTED_FOLLOWS: [
        'nick@offer.man',
        {
          email: 'vin@wil.com',
          campusId: mainCampus.id,
        },
        {
          email: 'jim@bob.com',
          campusId: satCampus.id,
        },
      ],
    });

    const me = await sequelize.models.people.create({
      originId: '4',
      originType: 'rock',
      firstName: 'Me',
      lastName: 'Myself',
      campusId: satCampus.id,
    });

    const suggestedFollowers = await followDataSource.getStaticSuggestedFollowsFor(
      me
    );

    expect(suggestedFollowers.map(({ email }) => email)).toEqual([
      'jim@bob.com',
      'nick@offer.man',
    ]);
  });

  it("should get a user's list of sugggested people to follow if they have no campus", async () => {
    // Lengthy setup :g
    const mainCampus = await sequelize.models.campus.create({
      name: 'Main Campus',
      originId: '1',
      originType: 'rock',
    });
    const satCampus = await sequelize.models.campus.create({
      name: 'Satilite Campus',
      originId: '2',
      originType: 'rock',
    });
    await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Jim',
      lastName: 'Bob',
      email: 'jim@bob.com',
      campusId: satCampus.id,
    });
    await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      email: 'vin@wil.com',
      campusId: mainCampus.id,
    });
    await sequelize.models.people.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Nick',
      lastName: 'Offerman',
      email: 'nick@offer.man',
    });
    ApollosConfig.loadJs({
      SUGGESTED_FOLLOWS: [
        'nick@offer.man',
        {
          email: 'vin@wil.com',
          campusId: mainCampus.id,
        },
        {
          email: 'jim@bob.com',
          campusId: satCampus.id,
        },
      ],
    });

    const me = await sequelize.models.people.create({
      originId: '4',
      originType: 'rock',
      firstName: 'Me',
      lastName: 'Myself',
      campusId: null,
    });

    const suggestedFollowers = await followDataSource.getStaticSuggestedFollowsFor(
      me
    );

    expect(suggestedFollowers.map(({ email }) => email)).toEqual([
      'nick@offer.man',
    ]);
  });

  it('should not suggest a user follows themselves', async () => {
    const me = await sequelize.models.people.create({
      originId: '4',
      originType: 'rock',
      firstName: 'Me',
      lastName: 'Myself',
      email: 'me@me.com',
    });
    ApollosConfig.loadJs({
      SUGGESTED_FOLLOWS: ['me@me.com'],
    });

    currentPersonId = me.id;

    const suggestedFollowers = await followDataSource.getStaticSuggestedFollowsFor(
      me
    );

    expect(suggestedFollowers.map(({ email }) => email)).toEqual([]);
  });
  it('should throw an error when passing a non-uuid to getStaticSuggestedFollowsFor', async () => {
    const invalidCampus = followDataSource.getStaticSuggestedFollowsFor({
      campusId: 1,
    });
    await expect(invalidCampus).rejects.toMatchSnapshot();

    const invalidId = followDataSource.getStaticSuggestedFollowsFor({ id: 1 });
    await expect(invalidId).rejects.toMatchSnapshot();
  });

  it('should not suggest a user follows someone they already follow', async () => {
    const me = await sequelize.models.people.create({
      originId: '4',
      originType: 'rock',
      firstName: 'Me',
      lastName: 'Myself',
      email: 'me@me.com',
    });
    const followedAlready = await sequelize.models.people.create({
      originId: '5',
      originType: 'rock',
      firstName: 'Me',
      lastName: 'Myself',
      email: 'followed@already.com',
    });

    await sequelize.models.follows.create({
      requestPersonId: me.id,
      followedPersonId: followedAlready.id,
      state: 'ACCEPTED',
    });

    ApollosConfig.loadJs({
      SUGGESTED_FOLLOWS: ['followed@already.com'],
    });

    currentPersonId = me.id;

    const suggestedFollowers = await followDataSource.getStaticSuggestedFollowsFor(
      me
    );

    expect(suggestedFollowers).toEqual([]);
  });
  it('should throw an error when passing a non-uuid to getStaticSuggestedFollowsFor', async () => {
    const invalidCampus = followDataSource.getStaticSuggestedFollowsFor({
      campusId: 1,
    });
    await expect(invalidCampus).rejects.toMatchSnapshot();

    const invalidId = followDataSource.getStaticSuggestedFollowsFor({ id: 1 });
    await expect(invalidId).rejects.toMatchSnapshot();
  });
});
