#!/usr/bin/env node

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import util from 'util';
import { exec as baseExec } from 'child_process';
import prompts from 'prompts';
import { execa } from 'execa';
import { program, Argument } from 'commander';

/* eslint-disable import/extensions */
import logo from './commands/logo.js';
import makeDeployCommand from './commands/deploy.js';

const exec = util.promisify(baseExec);

const __dirname = dirname(fileURLToPath(import.meta.url));

program.name('apollos');
program.version('1.0.0');

const mobile = program
  .command('mobile')
  .description('Manage Apollos mobile apps');

mobile.addCommand(makeDeployCommand());

mobile
  .command('init')
  .description('Create new mobile app')
  .action(() => {
    const questions = [
      {
        type: 'text',
        name: 'appName',
        message: 'App name?',
      },
      {
        type: 'text',
        name: 'iosID',
        message: 'iOS Bundle Identifier?',
        initial: (prev) =>
          `com.apollos.${prev.toLowerCase().replace(/ /g, '-')}`,
        validate: (value) =>
          value.match(/[A-Za-z0-9-.]+/)[0] === value
            ? true
            : `Alphanumeric, hyphens, and periods only!`,
      },
      {
        type: 'text',
        name: 'androidID',
        message: 'Android App ID?',
        initial: (prev) => prev,
        validate: (value) =>
          value.match(/[A-Za-z0-9-.]+/)[0] === value
            ? true
            : `Alphanumeric, hyphens, and periods only!`,
      },
      {
        type: 'text',
        name: 'serverURL',
        message: 'Server URL?',
        validate: (value) =>
          value.match(/^http.*/)[0] === value ? true : `Must be a valid URL!`,
      },
      {
        type: 'text',
        name: 'googleMapsKey',
        message: 'Google Maps API Key?',
      },
      {
        type: 'text',
        name: 'encryptionKey',
        message: 'Encryption Key?',
      },
    ];

    (async () => {
      const response = await prompts(questions);
      if (Object.keys(response).length === questions.length) {
        try {
          execa(`${__dirname}/scripts/create-mobile.sh`, [
            response.appName,
            response.iosID,
            response.androidID,
            response.serverURL,
            response.googleMapsKey,
            response.encryptionKey,
          ]).stdout.pipe(process.stdout);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  });

mobile
  .command('logo')
  .description('Edit app icons and splash screen')
  .action(() => logo());

mobile
  .command('versions')
  .description('Get current App Store and Play Store versions')
  .action(() => {
    const questions = [
      {
        type: 'text',
        name: 'appleID',
        message: 'Apple ID?',
      },
    ];
    (async () => {
      const response = await prompts(questions);
      if (Object.keys(response).length === 1) {
        try {
          execa(`${__dirname}/scripts/get-mobile-versions.sh`, [
            response.appleID,
          ]).stdout.pipe(process.stdout);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  });

const upgradeTag = new Argument('[tag]').default('latest');

program
  .command('upgrade')
  .description('Upgrades Apollos NPM packages')
  .addArgument(upgradeTag)
  .action((tag) =>
    execa(`${__dirname}/scripts/upgrade.sh`, [tag]).stdout.pipe(process.stdout)
  );

program
  .command('secrets')
  .description("Decrypt or encrypt your app's secrets")
  .argument('<password>')
  .option('-d', 'decrypt shared files')
  .option('-e', 'encrypt shared files')
  .action((password, options) => {
    if ((options.d && options.e) || (!options.d && !options.e))
      console.error('Must use either -e or -d, not both');
    if (options.d) {
      exec(`${__dirname}/scripts/secrets.sh -d ${password}`).then(
        ({ stdout, stderr }) => {
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.log(stderr);
          }
        }
      );
    }
    if (options.e) {
      exec(`${__dirname}/scripts/secrets.sh -e ${password}`).then(
        ({ stdout, stderr }) => {
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.log(stderr);
          }
        }
      );
    }
  });

program.parse();
