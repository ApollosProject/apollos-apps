import path, { resolve } from 'path';
import { promises } from 'fs';

import pg from 'pg';

const { Client } = pg;
const __dirname = path.resolve();
const { readdir } = promises;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    yield [res, dir];
  }
}

(async () => {
  for await (const f of getFiles(`${__dirname}/src/postgres/migrations`)) {
    const [file] = f;
    if (file.split('.').at(-1) == 'js') {
      const m = await import(file);
      const oldName = m.default.name;
      const newName = file.split('/').at(-1);
      const updateQuery = `UPDATE "SequelizeMeta" SET name = '${newName}' where name = '${oldName}'`;
      const res = await client.query(updateQuery);
      console.log(res);
    }
  }
  client.end();
})();
