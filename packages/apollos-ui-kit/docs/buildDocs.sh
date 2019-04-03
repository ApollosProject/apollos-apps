#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const generateMarkdown = require('./generateMarkdown');

let json = '';
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    json += chunk;
  }
});

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
  // api is an object keyed by filepath. We use the file name as component name.
  for (const filepath in api) {
    const name = getComponentName(filepath);
    const markdown = generateMarkdown(name, api[filepath]);
    fs.mkdir(path.dirname(`docs/generated/${name}.md`), { recursive: true });
    fs.writeFileSync(`docs/generated/${name}.md`, markdown);
    process.stdout.write(`${filepath} -> ${name}.md\n`);
  }
}

process.stdin.on('end', () => {
  buildDocs(JSON.parse(json));
});
