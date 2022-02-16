import { Client } from 'pg';

import { times } from 'lodash';
import { dbName } from './src/postgres/test-connect';

const createTestDB = async (client, name) => {
  await client.query(`DROP DATABASE IF EXISTS ${name};`);
  await client.query(`CREATE DATABASE ${name};`);
  const dbTestClient = new Client({
    host: 'localhost',
    database: name,
  });
  await dbTestClient.connect();
  await dbTestClient.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await dbTestClient.end();
};

export default async ({ maxWorkers }) => {
  // connect to the default service so we can create the test DBs
  const client = new Client({
    host: 'localhost',
    database: 'postgres',
  });
  await client.connect();

  await Promise.all(
    times(maxWorkers, (i) => {
      const name = dbName(i + 1);
      return createTestDB(client, name);
    })
  );

  await client.end();
};

