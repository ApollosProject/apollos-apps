import { sequelize, sync } from '../../postgres/index';
import { createModel, FollowState } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import FollowRequestDataSource from '../dataSource';

const uuid1 = '82182626-4331-4506-a87b-490cb9ffae2e';
const uuid2 = '70bfd529-cbf0-4fdf-b6e6-415278d3f5cb';

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
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore existing unaccepted request', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    // Send another request
    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should ignore request', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({
      followedPersonId: uuid1,
    });

    // Find and deny the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });
    const ignoreResult = await requestFollowDataSource.ignoreFollowRequest({
      followRequestId: existingRequest.id,
    });

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(existingRequest.state).toBe(FollowState.DECLINED);
    expect(existingRequest.id).toBe(ignoreResult.followRequestId);
  });

  it('should accept request', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    // Find and accept the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });
    const acceptResult = await requestFollowDataSource.acceptFollowRequest({
      followRequestId: existingRequest.id,
    });

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(existingRequest.state).toBe(FollowState.ACCEPTED);
    expect(existingRequest.id).toBe(acceptResult.followRequestId);
  });

  it('should ignore existing accepted request', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    // Find and accept the request
    const existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });
    await requestFollowDataSource.acceptFollowRequest({
      followRequestId: existingRequest.id,
    });

    // Send another request
    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.ACCEPTED);
  });

  it('should reset existing denied request', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    // Find and deny the request
    const existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });
    await requestFollowDataSource.ignoreFollowRequest({
      followRequestId: existingRequest.id,
    });

    // Send another request
    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    const follows = await requestFollowDataSource.model.findAll({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(follows.length).toBe(1);
    expect(follows[0].state).toBe(FollowState.REQUESTED);
  });

  it('should only process accept for current user', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    // Change the current person
    currentPersonId = 999;

    // Find and try to accept the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });

    // Make sure the error assertion is made by expecting all the assertions below
    expect.assertions(2);

    try {
      await requestFollowDataSource.acceptFollowRequest({
        followRequestId: existingRequest.id,
      });
    } catch (e) {
      expect(e).toBeTruthy();
    }

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(existingRequest.state).toBe(FollowState.REQUESTED);
  });

  it('should only process ignore for current user', async () => {
    const requestFollowDataSource = new FollowRequestDataSource();

    requestFollowDataSource.initialize({ context });

    await requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

    // Change the current person
    currentPersonId = 999;

    // Find and try to ignore the request
    let existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });

    // Make sure the error assertion is made by expecting all the assertions below
    expect.assertions(2);

    try {
      await requestFollowDataSource.ignoreFollowRequest({
        followRequestId: existingRequest.id,
      });
    } catch (e) {
      expect(e).toBeTruthy();
    }

    existingRequest = await requestFollowDataSource.model.findOne({
      where: {
        followedPersonId: uuid1,
      },
    });

    expect(existingRequest.state).toBe(FollowState.REQUESTED);
  });
});
