import { Client } from 'pg';
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

  let count = 1;

  while (count <= maxWorkers) {
    const name = dbName(count);

    // eslint-disable-next-line no-await-in-loop
    await createTestDB(client, name);

    count += 1;
  }

  await client.end();
};
