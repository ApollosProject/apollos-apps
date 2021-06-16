#! /usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const commander = require('commander');

commander.on('command:*', () => {
  console.log(`${commander.args.join(' ')} is not a valid command`);
  process.exit(1);
});

const cmd = commander
  .command('secrets')
  .description("Decrypt or encyrpt your app's secrets")
  .action(function () {
    const passedOptions = this.opts();
    return exec(
      `${__dirname}/scripts/secrets.sh -${Object.keys(
        passedOptions
      )} ${Object.values(passedOptions)}`
    ).then(({ stdout, stderr }) => {
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }
    });
  });

const options = [
  {
    command: '-d <secret>',
  },
  {
    command: '-e <secret>',
  },
];

options.forEach((opt) => {
  cmd.option(opt.command);
});

function setupAndRun() {
  commander.parse(process.argv);
}

setupAndRun();
