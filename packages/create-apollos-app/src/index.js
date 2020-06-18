const fs = require('fs');
const cp = require('child_process');
const { Command, flags: Flags } = require('@oclif/command');
// const { cli } = require('cli-ux');
const fetch = require('node-fetch');
const Zip = require('adm-zip');

module.exports = class CreateApollosAppCommand extends Command {
  static description = 'Create an apollos app';

  static args = [
    {
      name: 'name',
      required: true,
      description: 'The name of your project',
    },
  ];

  static flags = {
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
  };

  async run() {
    try {
      const { flags, args } = this.parse(CreateApollosAppCommand);

      const projectPath = `${flags.dir}/${args.name}`;
      if (fs.existsSync(projectPath)) {
        throw new Error('Project already exists!');
      }

      // eslint-disable-next-line
      this.log(`Creating apollos app at ${flags.dir}/${args.name} (Version: ${flags.release})`);

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

      // Download zip
      const zipPath = `${flags.dir}/${args.name}.zip`;
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }
      const zipFile = await fetch(url);
      const file = fs.createWriteStream(zipPath);
      await new Promise((resolve) => {
        zipFile.body.pipe(file).on('finish', resolve);
      });

      // Extract zip
      const zip = new Zip(zipPath);
      const zipRootDirectory = zip.getEntries()[0].entryName;
      zip.extractAllTo(`${flags.dir}/.tmp`, true);
      fs.unlinkSync(zipPath);
      // eslint-disable-next-line
      fs.renameSync(`${flags.dir}/.tmp/${zipRootDirectory}`, projectPath);
      cp.execSync(`rm -rf ${flags.dir}/.tmp`);
    } catch (err) {
      this.error(err.message);
    }
  }
};
