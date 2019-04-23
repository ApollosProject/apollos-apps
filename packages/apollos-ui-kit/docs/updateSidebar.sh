#!/usr/bin/env node

const fs = require('fs');

function updateSidebars(sidebars) {
  console.log(sidebars);
  const docs = JSON.parse(fs.readFileSync(`docs/generated/docs.json`));
  console.log(docs);
  const newSideBars = sidebars;
  newSideBars.docs['UI-Kit'] = docs['UI-Kit'];
  console.log(newSideBars);
  fs.writeFileSync(
    `docs/generated/sidebars.json`,
    JSON.stringify(sidebars, null, 2)
  );
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
  updateSidebars(JSON.parse(json));
});
