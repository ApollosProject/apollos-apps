import ApollosConfig from '@apollosproject/config';
import { sequelize, sync } from '../../postgres/index';
import { createModel, FollowState, setupModel } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import {
  createModel as createCampusModel,
  setupModel as setupCampusModel,
} from '../../campus/model';
import FollowDataSource from '../dataSource';
import PeopleDataSource from '../../people/dataSource';

let currentPersonId;

const context = {
  dataSources: {
    Auth: {},
    Person: {
      whereCurrentPerson: () => ({ id: currentPersonId }),
      getCurrentPersonId: () => currentPersonId,
    },
  },
};

let person1;
let person2;
let person3;
let person4;

describe('Apollos Postgres FollowRequest DataSource', () => {
  beforeEach(async () => {
    await createPeopleModel();
    await createModel();
    await setupModel();
    await createCampusModel();
    await setupCampusModel();
    await sync({ force: true });

    // Make sure people exist for all of our test ids
    const peopleDataSource = new PeopleDataSource();
    peopleDataSource.initialize({ context });
    // frustrating that we have to do this, but it's easier to inject a fix here
    // then mock out the whole Person dataSource in the context.
    context.dataSources.Person.model = peopleDataSource.model;
    person1 = await sequelize.models.people.create({
      originId: '11',
      originType: 'rock',
    });
    person2 = await sequelize.models.people.create({
      originId: '22',
      originType: 'rock',
    });
    person3 = await sequelize.models.people.create({
      originId: '33',
      originType: 'rock',
    });
    person4 = await sequelize.models.people.create({
      originId: '44',
      originType: 'rock',
    });
    currentPersonId = person1.id;
  });
  afterEach(async () => {
    await sequelize.drop({});
    currentPersonId = 1;
  });

  it('should create new follow request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore existing unaccepted request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Send another request
    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and deny the request
    let existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    const ignoreResult = await followDataSource.ignoreFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.DECLINED);
    expect(existingRequest.id).toBe(ignoreResult.id);
  });

  it('should accept request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and accept the request
    let existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    const acceptResult = await followDataSource.acceptFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    existingRequest = await followDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(existingRequest.state).toBe(FollowState.ACCEPTED);
    expect(existingRequest.id).toBe(acceptResult.id);
  });

  it('should ignore existing accepted request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and accept the request
    await followDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    await followDataSource.acceptFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    currentPersonId = person1.id;

    // Send another request
    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.ACCEPTED);
  });

  it('should reset existing denied request', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    // Find and deny the request
    await followDataSource.model.findOne({
      where: {
        followedPersonId: person2.id,
      },
    });

    currentPersonId = person2.id;

    await followDataSource.ignoreFollowRequest({
      requestPersonId: `Person:${person1.id}`,
    });

    currentPersonId = person1.id;

    // Send another request
    await followDataSource.requestFollow({
      followedPersonId: `Person:${person2.id}`,
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: person2.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it("should get a user's list of sugggested people to follow", async () => {
    const followDataSource = new FollowDataSource();
    followDataSource.initialize({ context });
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

  it('should get a suggested people by id if specified', async () => {
    const followDataSource = new FollowDataSource();
    followDataSource.initialize({ context });
    // Lengthy setup :g
    await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Jim',
      lastName: 'Bob',
      email: 'jim@bob.com',
    });
    const dupe = await sequelize.models.people.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      email: 'vin@wil.com',
    });
    await sequelize.models.people.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Nick',
      lastName: 'Offerman',
      email: 'nick@offer.man',
    });
    await sequelize.models.people.create({
      originId: '4',
      originType: 'rock',
      firstName: 'Don',
      lastName: "T'Include",
      email: 'vin@wil.com', // same email as user 2
    });
    ApollosConfig.loadJs({
      SUGGESTED_FOLLOWS: [
        'nick@offer.man',
        {
          id: dupe.id,
          email: 'vin@wil.com',
        },
        {
          email: 'jim@bob.com',
        },
      ],
    });

    const me = await sequelize.models.people.create({
      originId: '5',
      originType: 'rock',
      firstName: 'Me',
      lastName: 'Myself',
    });

    const suggestedFollowers = await followDataSource.getStaticSuggestedFollowsFor(
      me
    );

    expect(suggestedFollowers.map(({ firstName }) => firstName)).toEqual([
      'Jim',
      'Vincent',
      'Nick',
    ]);
  });

  it("should get a user's list of sugggested people to follow if they have no campus", async () => {
    const followDataSource = new FollowDataSource();
    followDataSource.initialize({ context });
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
    const followDataSource = new FollowDataSource();
    followDataSource.initialize({ context });
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
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });
    const invalidCampus = followDataSource.getStaticSuggestedFollowsFor({
      campusId: 1,
    });
    await expect(invalidCampus).rejects.toMatchSnapshot();

    const invalidId = followDataSource.getStaticSuggestedFollowsFor({ id: 1 });
    await expect(invalidId).rejects.toMatchSnapshot();
  });

  it('should not suggest a user follows someone they already follow', async () => {
    const followDataSource = new FollowDataSource();
    followDataSource.initialize({ context });
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

  it('should automatically accept requests to follow a suggested user', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    const nick = await sequelize.models.people.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Nick',
      lastName: 'Offerman',
      email: 'nick@offer.man',
    });
    ApollosConfig.loadJs({
      SUGGESTED_FOLLOWS: ['nick@offer.man'],
    });

    await followDataSource.requestFollow({
      followedPersonId: `Person:${nick.id}`,
    });

    const follows = await followDataSource.model.findAll({
      where: {
        followedPersonId: nick.id,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.ACCEPTED);
  });

  it('should return list of users requesting to follow the current user', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    // Have several people follow user 1
    await Promise.all(
      [person2, person3, person4].map(({ id }) => {
        currentPersonId = id;
        return followDataSource.requestFollow({
          followedPersonId: `Person:${person1.id}`,
        });
      })
    );

    currentPersonId = person1.id;

    const follows = await followDataSource.followRequests();

    expect(follows.length).toBe(3);
    expect(follows.map((f) => f.id).includes(person1.id)).toBeFalsy();
  });

  it('should only return unanswered requests', async () => {
    const followDataSource = new FollowDataSource();

    followDataSource.initialize({ context });

    // Have several people follow user 1
    const followRange = [person2, person3, person4];
    await Promise.all(
      followRange.map(({ id }) => {
        currentPersonId = id;
        return followDataSource.requestFollow({
          followedPersonId: `Person:${person1.id}`,
        });
      })
    );

    currentPersonId = person1.id;

    // accept one of the requests
    await followDataSource.acceptFollowRequest({
      requestPersonId: `Person:${person2.id}`,
    });

    const follows = await followDataSource.followRequests();

    // Should be one fewer request
    expect(follows.length).toBe(followRange.length - 1);
  });
});
