#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const generateMarkdown = require('./generateMarkdown');
const generateID = require('./generateID');

function getComponentName(filepath) {
  let name = path.basename(filepath);
  // check for index.js
  if (name === 'index.js') {
    const dirs = path.dirname(filepath).split('/');
    name = dirs[dirs.length - 1];
  }
  let ext;
  while ((ext = path.extname(name))) {
    name = name.substring(0, name.length - ext.length);
  }
  return name;
}

function buildDocs(api) {
  const docsList = [];
  const dir = `docs/generated`;
  // api is an object keyed by filepath. We use the file name as component name.
  Object.keys(api).forEach((filepath) => {
    const name = getComponentName(filepath);
    docsList.push(`ui-kit/${generateID(name)}`);
    const markdown = generateMarkdown(name, api[filepath]);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${name}.md`, markdown);
    process.stdout.write(`${filepath} -> ${name}.md\n`);
  });
  const docsObj = { 'UI-Kit': docsList };
  fs.writeFileSync(`${dir}/docs.json`, JSON.stringify(docsObj));
}

let json = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    json += chunk;
  }
});

process.stdin.on('end', () => {
  buildDocs(JSON.parse(json));
});
