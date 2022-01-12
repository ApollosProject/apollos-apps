/* eslint-disable import/named */
import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { getSequelize } from '../../postgres/index';
import PeopleDataSource from '../dataSource';
import * as People from '../index';
import {
  ContentItem,
  Media,
  ContentItemCategory,
  Campus,
  Follow,
} from '../../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

let personId;

const Config = new ConfigDataSource();
Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

const context = {
  dataSources: {
    Auth: {
      getCurrentPerson: () => ({ id: personId }),
      ORIGIN_TYPE: 'rock',
    },
    BinaryFiles: {
      uploadFile: jest.fn(() => Promise.resolve('456')),
      findOrReturnImageUrl: () => 'https://the.image.com/bop.jaz',
    },
    Config,
  },
  church: { slug: 'apollos_demo' },
};

describe('Apollos Postgres People DataSource', () => {
  let peopleDataSource;
  let sequelize;
  let globalSequelize;

  beforeEach(async () => {
    personId = 1;
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    context.currentPostgresPerson = null;

    await setupPostgresTestEnv(
      [People, ContentItem, Media, ContentItemCategory, Campus, Follow],
      { church: { slug: 'apollos_demo' } }
    );

    peopleDataSource = new PeopleDataSource();
    peopleDataSource.initialize({ context });
  });

  afterEach(async () => {
    await sequelize.drop({ cascade: true });
    await globalSequelize.drop({ cascade: true });
  });

  it('should find a user by a rock id', async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
    });

    const person = await peopleDataSource.getFromId(1, null, {
      originType: 'rock',
    });

    expect(person.firstName).toBe('Vincent');
    expect(person.originId).toBe('1');
    expect(person.id).toBeDefined();
  });

  it('should find a current user id', async () => {
    const currentPerson = await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
    });

    const fetchedId = await peopleDataSource.getCurrentPersonId();

    expect(fetchedId).toBe(currentPerson.id);
  });

  it('should throw an error if current user isnt in the db', async () => {
    personId = 2;
    expect.assertions(1);
    try {
      await peopleDataSource.getCurrentPersonId();
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  it('should find a user by postgres id', async () => {
    const newPerson = await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
    });

    const person = await peopleDataSource.getFromId(newPerson.id);

    expect(person.firstName).toBe('John');
    expect(person.originId).toBe('1');
    expect(person.id).toBe(newPerson.id);
  });

  it('should be able to search a user', async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
      apollosUser: true,
    });
    await peopleDataSource.model.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Phil',
      lastName: 'Woodhall',
      apollosUser: true,
    });

    const foundPerson = await peopleDataSource.model.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Found',
      apollosUser: true,
    });

    const edges = await peopleDataSource.byPaginatedQuery({ name: 'Vincent' });

    expect(edges.length).toBe(1);
    expect(edges[0].node.id).toBe(foundPerson.id);
  });

  it('should not return non-apollos users when searching', async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
      apollosUser: true,
    });
    await peopleDataSource.model.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Phil',
      lastName: 'Woodhall',
      apollosUser: true,
    });

    await peopleDataSource.model.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Found',
      apollosUser: false,
    });

    const edges = await peopleDataSource.byPaginatedQuery({ name: 'Vincent' });

    expect(edges.length).toBe(0);
  });

  it('should trim whitespace from string when searching', async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
      apollosUser: true,
    });
    await peopleDataSource.model.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Phil',
      lastName: 'Woodhall',
      apollosUser: true,
    });

    const foundPerson = await peopleDataSource.model.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Found',
      apollosUser: true,
    });

    const edges = await peopleDataSource.byPaginatedQuery({
      name: 'Vincent Found   ',
    });

    expect(edges.length).toBe(1);
    expect(edges[0].node.id).toBe(foundPerson.id);
  });

  it('should create a user', async () => {
    const newPersonId = await peopleDataSource.create({
      FirstName: 'Vincent',
      lastName: 'Vincent',
      Gender: 'Male',
      originId: 1,
      originType: 'rock',
    });

    const newPerson = await peopleDataSource.getFromId(newPersonId);

    expect(newPerson.firstName).toBe('Vincent');
    expect(newPerson.gender).toBe('MALE');
  });

  it('update a users attributes', async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
    });

    personId = 1;
    const person = await peopleDataSource.updateProfile([
      { field: 'FirstName', value: 'Milton' },
    ]);

    expect(person.firstName).toBe('Milton');

    const updatedPerson = await peopleDataSource.getFromId(person.id);

    expect(updatedPerson.firstName).toBe('Milton');
  });

  it('update a users gender', async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
    });

    personId = 1;
    const person = await peopleDataSource.updateProfile([
      { field: 'Gender', value: 'Male' }, // lowercase, like the gql value
    ]);

    expect(person.gender).toBe('MALE'); // uppercase, like the postgres enum

    const updatedPerson = await peopleDataSource.getFromId(person.id);

    expect(updatedPerson.gender).toBe('MALE');
  });

  it("uploads a user's profile picture", async () => {
    await peopleDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Williams',
    });

    personId = 1;
    const person = await peopleDataSource.uploadProfileImage(
      { createReadStream: () => '123', filename: 'img.jpg' },
      456
    );

    expect(person.profileImageUrl).toBe('https://the.image.com/bop.jaz');

    const updatedPerson = await peopleDataSource.getFromId(person.id);

    expect(updatedPerson.profileImageUrl).toBe('https://the.image.com/bop.jaz');
  });
});
