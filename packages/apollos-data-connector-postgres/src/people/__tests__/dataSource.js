import { sequelize, sync } from '../../postgres/index';
import { createModel } from '../model';
import PeopleDataSource from '../dataSource';

let personId;

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
  },
};

describe('Apollos Postgres People DataSource', () => {
  let peopleDataSource;

  beforeEach(async () => {
    personId = 1;

    await createModel();
    await sync();

    peopleDataSource = new PeopleDataSource();
    peopleDataSource.initialize({ context });
  });

  afterEach(async () => {
    await sequelize.drop({});
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
