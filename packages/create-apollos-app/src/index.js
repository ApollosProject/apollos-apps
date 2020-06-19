const fs = require('fs');
const cp = require('child_process');
const { Command, flags: Flags } = require('@oclif/command');
// const { cli } = require('cli-ux');
const fetch = require('node-fetch');
const Zip = require('adm-zip');
const rm = require('rimraf');

class CreateApollosAppCommand extends Command {
  async run() {
    try {
      const { flags, args } = this.parse(CreateApollosAppCommand);

      const projectPath = `${flags.dir}/${args.name}`;
      if (fs.existsSync(projectPath)) {
        throw new Error('Project already exists!');
      }

      // eslint-disable-next-line
      this.log(`Creating apollos app at ${projectPath} (Version: ${flags.release})`);

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
      cp.execSync(`cd ${projectPath}/apolloschurchapp && npx react-native-rename "${appName}" -b ${flags.bundleIdentifier || `org.church.${appName}`}`, { stdio: 'inherit' });

      // Install Dependencies
      cp.execSync(`cd ${projectPath} && yarn`, { stdio: 'inherit' });
      cp.execSync(`cd ${projectPath} && yarn pods`, { stdio: 'inherit' });

      const defaultAppEnv = `
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
};

module.exports = CreateApollosAppCommand;
