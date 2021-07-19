import { Client } from 'pg';
import { times } from 'lodash';
import { ensureLocalDb } from './src/postgres/local-db';
import { dbName } from './src/postgres/test-connect';

export default async ({ maxWorkers }) => {
  const client = new Client({
    host: 'localhost',
    database: 'postgres',
  });

  try {
    await client.connect();
  } catch (e) {
    console.error('Failed to connect to local postgres instance');
    console.error(e);
  }

  await Promise.all(
    times(maxWorkers, (i) => {
      const name = dbName(i + 1);
      return ensureLocalDb(client, name, true);
    })
  );

  await client.end();
};
