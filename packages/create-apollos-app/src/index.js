const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const { Command, flags: Flags } = require('@oclif/command');
const chalk = require('chalk');
const fetch = require('node-fetch');
const Zip = require('adm-zip');
const rm = require('rimraf');

class CreateApollosAppCommand extends Command {
  async run() {
    try {
      const { flags, args } = this.parse(CreateApollosAppCommand);
      const stdio = args.debug ? 'inherit' : 'ignore';

      const projectPath = `${flags.dir}/${args.name}`;
      if (fs.existsSync(projectPath)) {
        throw new Error('Project already exists!');
      }

      // eslint-disable-next-line
      this.log(chalk.green(`Creating apollos app at ${projectPath} (Version: ${flags.release})`));
      this.log(chalk.green('Downloading...'));

      // Identify version
      let url = '';
      if (flags.release === 'edge') {
        // eslint-disable-next-line
        url = 'https://github.com/ApollosProject/apollos-templates/archive/master.zip';
      } else if (flags.release === 'latest') {
        // NOTE: Not too sure why releases was returning a blank array, maybe we don't have any releases?
        // eslint-disable-next-line
        const releases = await fetch('https://api.github.com/repos/ApollosProject/apollos-templates/tags?per_page=1').then((r) => r.json());
        const latestRelease = releases[0];

        url = latestRelease.zipball_url;
      } else {
        // eslint-disable-next-line
        url = `https://api.github.com/repos/ApollosProject/apollos-templates/zipball/${flags.release}`;
      }

      // Set up hidden directory
      if (!fs.existsSync(this.config.dataDir)) {
        fs.mkdirSync(this.config.dataDir);
      }

      // Download zip
      const downloadPath = `${this.config.dataDir}/${args.name}.zip`;
      if (fs.existsSync(downloadPath)) {
        fs.unlinkSync(downloadPath);
      }
      const zipFile = await fetch(url);
      const file = fs.createWriteStream(downloadPath);
      await new Promise((resolve) => {
        zipFile.body.pipe(file).on('finish', resolve);
      });

      // Extract zip
      const zip = new Zip(downloadPath);
      const zipRootDirectory = zip.getEntries()[0].entryName;
      zip.extractAllTo(`${this.config.dataDir}/.tmp`, true);
      fs.unlinkSync(downloadPath);
      // eslint-disable-next-line
      fs.renameSync(`${this.config.dataDir}/.tmp/${zipRootDirectory}`, projectPath);

      // Clean up
      rm.sync(this.config.dataDir);

      // Rename Project
      const appName = flags.appName === '$name' ? args.name : flags.appName;
      // eslint-disable-next-line
      cp.execSync(`cd ${projectPath}/apolloschurchapp && npx react-native-rename "${appName}" -b ${flags.bundleIdentifier || `org.church.${appName}`}`, { stdio });
      this.log(chalk.green('Download complete'));

      // Install Dependencies
      this.log(chalk.green('Installing dependencies'));
      cp.execSync(`cd ${projectPath} && yarn`, { stdio: 'inherit' });
      cp.execSync(`cd ${projectPath} && yarn pods`, { stdio: 'inherit' });
      this.log(chalk.green('Dependencies installed'));

      // Core developer setup
      if (flags.core && !fs.existsSync(flags.coreComponentsLocation)) {
        this.log(chalk.green('Cloning apollos-apps'));
        // eslint-disable-next-line
        cp.execSync(`git clone https://github.com/ApollosProject/apollos-apps ${flags.coreComponentsLocation}`, { stdio });
        this.log(chalk.green('apollos-apps cloned'));
      }

      this.log(chalk.green('Setting up environment...'));
      // eslint-disable-next-line
      const defaultAppEnv = `${flags.core ? `APOLLOS_APPS_LOCATION='${path.resolve(flags.coreComponentsLocation)}'` : ''}
APP_DATA_URL='http://0.0.0.0:4000'
# ONE_SIGNAL_KEY=''
# GOOGLE_MAPS_API_KEY=''
# STORYBOOK=''
# SCHEMA_VERSION=''`;
      const defaultApiEnv = `
ROOT_URL='http://localhost:4000'
PORT=4000
ROCK_API=''
ROCK_TOKEN=''
BIBLE_API_KEY=''
TWILIO_ACCOUNT_SID=''
TWILIO_AUTH_TOKEN=''
TWILIO_FROM_NUMBER=''
# ENGINE_API_KEY=''
# CLOUDINARY_URL=''
# ONE_SIGNAL_REST_KEY=''
# PASS_WWDR_CERT=''
# PASS_SIGNER_CERT=''
# PASS_SIGNER_KEY=''
# PASS_SIGNER_PASSPHRASE=''`;

      // Stub out environment
      fs.writeFileSync(`${projectPath}/apolloschurchapp/.env`, defaultAppEnv);
      fs.writeFileSync(`${projectPath}/apollos-church-api/.env`, defaultApiEnv);
      this.log(chalk.green('Environment set up'));

      /* eslint-disable */
      this.log(chalk.green(`Created apollos app at ${projectPath} (Version: ${flags.release})`));
      this.log(chalk.green(`Run the project locally with this command: cd ${projectPath} && yarn start`));
      this.log(chalk.green('[View the project locally]'));
      this.log(chalk.green(`iOS simulator: cd ${projectPath} && yarn ios`));
      this.log(chalk.green(`Android simulator: cd ${projectPath} && yarn android`));
      /* eslint-enable */
    } catch (err) {
      this.error(err.message);
    }
  }
}

CreateApollosAppCommand.description = 'Create an apollos app';

CreateApollosAppCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'The name of your project',
  },
];

CreateApollosAppCommand.flags = {
  // add --version flag to show CLI version
  version: Flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: Flags.help({ char: 'h' }),
  debug: Flags.boolean({ char: 'g' }),
  dir: Flags.string({
    char: 'd',
    description:
      'The directory where you want your project relative to your current working directory',
    default: '.',
  }),
  release: Flags.string({
    char: 'r',
    description: 'The release you want to use for your project',
    default: 'latest',
  }),
  appName: Flags.string({
    char: 'n',
    description: 'The name to use for your app, this will be displayed',
    default: '$name',
  }),
  bundleIdentifier: Flags.string({
    char: 'b',
    description: 'The bundle identifier to use for your iOS app',
  }),
  core: Flags.boolean({
    char: 'c',
    // eslint-disable-next-line
    description: 'Set to true if you\'re developing core components',
    default: false,
  }),
  coreComponentsLocation: Flags.string({
    char: 'l',
    dependsOn: ['core'],
    // eslint-disable-next-line
    description: 'The location for your components (the apollos-apps repo). If you already cloned apollos-apps make sure to point this at your clone',
    default: './apollos-apps',
  }),
};

module.exports = CreateApollosAppCommand;
