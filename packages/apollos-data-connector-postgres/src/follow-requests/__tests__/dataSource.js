import { sequelize, sync } from '../../postgres/index';
import { createModel } from '../model';
import { createModel as createPeopleModel } from '../../people/model';
import FollowRequestDataSource from '../dataSource';

const uuid1 = '82182626-4331-4506-a87b-490cb9ffae2e';
const uuid2 = '70bfd529-cbf0-4fdf-b6e6-415278d3f5cb';

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: 1 }),
    },
    Person: {
      resolveId: () => uuid2,
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
    expect(follows[0].accepted).toBe(null);
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
    expect(follows[0].accepted).toBe(null);
  });

  // TODO: should ignore existing accepted request

  // it('should reset existing denied request', async () => {
  //   const requestFollowDataSource = new FollowRequestDataSource();

  //   requestFollowDataSource.initialize({ context });

  //   requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

  //   // TODO: deny request

  //   // Send another request
  //   requestFollowDataSource.requestFollow({ followedPersonId: uuid1 });

  //   const follows = await requestFollowDataSource.model.findAll({
  //     where: {
  //       followedPersonId: uuid1,
  //     },
  //   });

  //   expect(follows.length).toBe(1);
  //   expect(follows[0].accepted).toBe(null);
  // });
});
