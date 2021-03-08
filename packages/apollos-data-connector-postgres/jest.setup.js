import { Client } from 'pg';
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

  let count = 1;

  while (count <= maxWorkers) {
    const name = dbName(count);

    // eslint-disable-next-line no-await-in-loop
    await ensureLocalDb(client, name, true);

    count += 1;
  }

  await client.end();
};
