/* eslint-disable import/named, new-cap */
import ApollosConfig from '@apollosproject/config';
import { sequelize } from '../../postgres/index';
import {
  Media,
  Tag,
  Person,
  Campus,
  PrayerRequest,
  Follow,
  ContentItem,
  ContentItemCategory,
} from '../../index';

import { setupPostgresTestEnv } from '../../utils/testUtils';

let person1;
let person2;
let person3;

let currentPerson;

const context = {
  dataSources: {
    Person: {
      getCurrentPerson: () => currentPerson,
      getCurrentPersonId: () => currentPerson.id,
    },
  },
};

ApollosConfig.loadJs({
  CONTENT: {},
});

const PrayerRequestDataSource = PrayerRequest.dataSource;

describe('Apollos Postgres Prayer Request DataSource', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      Media,
      ContentItem,
      ContentItemCategory,
      Follow,
      Tag,
      Person,
      Campus,
      PrayerRequest,
    ]);
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
    await sequelize.drop({ cascade: true });
  });

  it('adds a PrayerRequest', async () => {
    const prayerRequestDatasource = new PrayerRequestDataSource();
    prayerRequestDatasource.initialize({ context });

    const prayer1 = await prayerRequestDatasource.addPrayer({
      text: 'Test prayer!',
    });

    const currentPersonPrayers = await currentPerson.getPrayerRequests();

    expect(currentPersonPrayers[0].id).toEqual(prayer1.id);
  });

  it('fetches a DailyPrayerFeed', async () => {
    const prayerRequestDatasource = new PrayerRequestDataSource();
    prayerRequestDatasource.initialize({ context });

    // Create follow to check correct order
    await sequelize.models.follows.create({
      requestPersonId: currentPerson.id,
      followedPersonId: person2.id,
      state: 'ACCEPTED',
    });

    const prayer1 = await sequelize.models.prayerRequest.create({
      text: 'Person One Prayer',
    });
    const prayer2 = await sequelize.models.prayerRequest.create({
      text: 'Person Two Prayer',
    });
    await person2.addPrayerRequest(prayer1);
    await person3.addPrayerRequest(prayer2);

    const dailyPrayerFeed = await prayerRequestDatasource.byDailyPrayerFeed({});

    expect(dailyPrayerFeed.length).toEqual(2);
    expect(dailyPrayerFeed[0].id).toEqual(prayer1.id);
    expect(dailyPrayerFeed[1].id).toEqual(prayer2.id);
  });

  it('prays for a PrayerRequest', async () => {
    const prayerRequestDatasource = new PrayerRequestDataSource();
    prayerRequestDatasource.initialize({ context });

    const prayer1 = await sequelize.models.prayerRequest.create({
      text: 'Test Prayer',
    });
    await person2.addPrayerRequest(prayer1);
    await prayerRequestDatasource.incrementPrayed(prayer1.id);
    const usersPrayed = await prayer1.getPrayedUsers({
      where: {
        id: currentPerson.id,
      },
    });

    expect(usersPrayed.length).toEqual(1);
    expect(usersPrayed[0].id).toEqual(currentPerson.id);
  });
});
