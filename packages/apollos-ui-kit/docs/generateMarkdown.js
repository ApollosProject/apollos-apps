/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const generateID = require('./generateID');

function stringOfLength(string, length) {
  let newString = '';
  for (let i = 0; i < length; i++) {
    newString += string;
  }
  return newString;
}

function generateTitle(name) {
  return `\`${name}\` (component)`;
}

function generateDocusaurusHeader(name) {
  const id = `id: ${generateID(name)}`;
  const title = `title: ${generateTitle(name)}`;
  const label = `sidebar_label: ${name.charAt(0).toUpperCase() +
    name.slice(1)}`;
  return `---\n${id}\n${title}\n${label}\n---`;
}

function generateDesciption(description) {
  return `${description}\n`;
}

function generatePropType(type) {
  let values;
  if (Array.isArray(type.value)) {
    values = `(${type.value
      .map((typeValue) => typeValue.name || typeValue.value)
      .join('|')})`;
  } else {
    values = type.value;
  }

  return `type: \`${type.name}${values || ''}\`\n`;
}

function generatePropDefaultValue(value) {
  return `defaultValue: \`${value.value}\`\n`;
}

function generateProp(propName, prop) {
  return (
    `### \`${propName}\`${prop.required ? ' (required)' : ''}\n` +
    `\n${prop.description ? `${prop.description}\n\n` : ''}${
      prop.type ? generatePropType(prop.type) : ''
    }${prop.defaultValue ? generatePropDefaultValue(prop.defaultValue) : ''}\n`
  );
}

function generateProps(props) {
  if (!props) return '\n';
  const title = 'Props';

  return (
    `${title}\n${stringOfLength('-', title.length)}\n` +
    `\n${Object.keys(props)
      .sort()
      .map((propName) => generateProp(propName, props[propName]))
      .join('\n')}`
  );
}

function generateMarkdown(name, reactAPI) {
  const markdownString = `${generateDocusaurusHeader(
    name
  )}\n${generateDesciption(reactAPI.description)}\n${generateProps(
    reactAPI.props
  )}`;

  return markdownString;
}

module.exports = generateMarkdown;
