const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readJson = async (path) => {
  const file = await readFileAsync(`${process.cwd()}/${path}`);
  return JSON.parse(file.toString());
};

(async () => {
  const apollosConfig = await readJson(`apollos.json`);
  const { version } = await readJson(`package.json`);

  const newConfig = { ...apollosConfig, version };

  await writeFileAsync(
    `${process.cwd()}/apollos.json`,
    JSON.stringify(newConfig, null, 4)
  );
})();
