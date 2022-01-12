/* eslint-disable import/named */
import { getSequelize } from '../../postgres/index';
import CampusDataSource from '../dataSource';
import * as Campus from '..';
import {
  Person,
  ContentItem,
  Media,
  Follow,
  ContentItemCategory,
} from '../../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

let personId;

const setCampusMock = jest.fn();

const context = {
  dataSources: {
    Person: {
      getCurrentPerson: () => ({ id: personId, setCampus: setCampusMock }),
    },
  },
  church: { slug: 'apollos_demo' },
};

let close;
let far;
let digital;
let inactive;

describe('Apollos Postgres Campus DataSource', () => {
  let campusDataSource;
  let sequelize;
  let globalSequelize;

  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    personId = 1;
    context.currentPostgresPerson = null;

    await setupPostgresTestEnv(
      [Person, Campus, Follow, Media, ContentItem, ContentItemCategory],
      { church: { slug: 'apollos_demo' } }
    );

    campusDataSource = new CampusDataSource();
    campusDataSource.initialize({ context });

    far = await campusDataSource.model.create({
      originId: '1',
      originType: 'rock',
      name: 'Portland',
      latitude: 45.52252,
      longitude: -122.67325,
      active: true,
    });

    close = await campusDataSource.model.create({
      originId: '2',
      originType: 'rock',
      name: 'Cincinnati',
      latitude: 39.10501,
      longitude: -84.51138,
      active: true,
    });

    digital = await campusDataSource.model.create({
      originId: '3',
      originType: 'rock',
      name: 'Inactive',
      latitude: 39.10501,
      longitude: -84.51138,
      active: true,
      digital: true,
    });

    inactive = await campusDataSource.model.create({
      originId: '4',
      originType: 'rock',
      name: 'Inactive',
      latitude: 39.10501,
      longitude: -84.51138,
      active: false,
    });
  });

  afterEach(async () => {
    await sequelize.drop({ cascade: true });
    await globalSequelize.drop({ cascade: true });
  });

  it('should return a list of campuses', async () => {
    const all = await campusDataSource.getAll();
    const ids = all.map(({ id }) => id);

    expect(ids).toContain(close.id);
    expect(ids).toContain(far.id);
    expect(ids).toContain(digital.id);
    expect(ids).not.toContain(inactive.id);
  });

  it('should return nearest campuses first', async () => {
    const all = await campusDataSource.getByLocation({
      latitude: 39.10501,
      longitude: -84.51138,
    });
    const ids = all.map(({ id }) => id);

    expect(all[0].distanceFromLocation).toEqual(0);

    expect(ids[0]).toEqual(close.id);
    expect(ids[1]).toEqual(far.id);
    expect(ids[2]).toEqual(digital.id);
  });

  it('should return digital campuses first if far away', async () => {
    const all = await campusDataSource.getByLocation({
      latitude: -39.10501,
      longitude: 84.51138,
    });
    const ids = all.map(({ id }) => id);

    expect(ids[0]).toEqual(digital.id);
    expect(ids[1]).toEqual(far.id);
    expect(ids[2]).toEqual(close.id);
  });

  it('should override certain fields for digital campuses', async () => {
    const street1 = campusDataSource.getAddressField({
      field: 'street1',
      root: { digital: true },
    });

    expect(street1).toEqual('No locations near you. ');
  });

  it('should allow a user to set their campus', async () => {
    const setCampusResult = await campusDataSource.updateCurrentUserCampus({
      campusId: close.apollosId,
    });

    expect(setCampusResult.id).toEqual(personId);
    expect(setCampusMock.mock.calls[0][0].id).toEqual(close.id);
  });
});
