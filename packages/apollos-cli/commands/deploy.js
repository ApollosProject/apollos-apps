import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import prompts from 'prompts';
import { Command, Argument } from 'commander';
import consola from 'consola';
import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default () => {
  const deploy = new Command('deploy');
  deploy.description('Manage deployments');

  const ios = new Command('ios');
  ios.description('Manage iOS deployments');

  ios
    .command('init')
    .description('Setup iOS deployments')
    .action(async () => {
      const appleIDquestion = [
        {
          type: 'text',
          name: 'appleID',
          message: 'Admin Apple Developer email?',
        },
      ];
      const questions = [
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Finished with the above commands?',
          initial: true,
        },
        {
          type: 'text',
          name: 'certsRepo',
          message: 'Private Github repo to store certificates?',
          validate: (value) =>
            value.match(/^http.*/)[0] === value ? true : `Must be a valid URL!`,
        },
        {
          type: 'text',
          name: 'ghUser',
          message: 'Github username?',
        },
        {
          type: 'text',
          name: 'ghToken',
          message: 'Github personal access token?',
        },
        {
          type: 'text',
          name: 'keyID',
          message: 'App Store Connect API - Key ID?',
        },
        {
          type: 'text',
          name: 'issuerID',
          message: 'App Store Connect API - Issuer ID?',
        },
        {
          type: 'text',
          name: 'key',
          message: 'App Store Connect API - P8 file?',
          validate: (value) =>
            fs.existsSync(path.normalize(value)) || "File doesn't exist!",
        },
        {
          type: 'text',
          name: 'teamID',
          message: 'Apple Developer Team ID?',
        },
        {
          type: 'text',
          name: 'teamName',
          message: 'Apple Developer Team Name?',
        },
      ];
      const { appleID } = await prompts(appleIDquestion);
      consola.info(
        'We use Fastlane for iOS deploys. There are some steps that cannot be automated.'
      );
      consola.info(
        'Run the following commands before proceeding in a separate terminal to create the bundle identifiers:'
      );
      const {
        stdout,
      } = await execa(`${__dirname}/../scripts/display-ios-setup-commands.sh`, [
        appleID,
      ]);
      consola.log(stdout);
      const response = await prompts(questions);
      if (Object.keys(response).length === questions.length) {
        execa(`${__dirname}/../scripts/setup-ios-deployments.sh`, [
          response.certsRepo,
          response.ghUser,
          response.ghToken,
          response.keyID,
          response.issuerID,
          response.key,
          response.teamID,
          response.teamName,
        ]).stdout.pipe(process.stdout);
      }
    });

  const iosTrack = new Argument('[track]')
    .choices(['internal', 'beta', 'production'])
    .default('internal');

  ios
    .command('publish')
    .description('Publish app to App Store')
    .addArgument(iosTrack)
    .action(async (track) => {
      const spinner = ora(`Deploying to ${track}...`).start();
      try {
        await execa(`${__dirname}/../scripts/deploy-ios.sh`, [track]);
      } catch (e) {
        spinner.fail('Failed');
        consola.log(e.stdout);
        process.exit(1);
      }
      spinner.succeed('Deployed!');
    });

  const android = new Command('android');
  android.description('Manage Android deployments');

  android
    .command('init')
    .description('Setup Android deployments')
    .action(async () => {
      const questions = [
        {
          type: 'text',
          name: 'key',
          message: 'Google Service Account Upload Key?',
          validate: (value) =>
            fs.existsSync(path.normalize(value)) || "File doesn't exist!",
        },
      ];

      const response = await prompts(questions);
      if (Object.keys(response).length === 1) {
        const child = execa(
          `${__dirname}/../scripts/setup-android-deployments.sh`,
          [response.key]
        );
        child.stdout.pipe(process.stdout);
        // Keystore cert credentials
        // we'll just leave them all as "Unknown"
        child.stdin.write('\n\n\n\n\n\nyes\n');
        child.stdin.end();
      }
    });

  const androidTrack = new Argument('[track]')
    .choices(['internal', 'alpha', 'beta', 'production'])
    .default('internal');

  android
    .command('publish')
    .description('Publish app to Google Play Store')
    .addArgument(androidTrack)
    .action(async (track) => {
      const spinner = ora(`Deploying to ${track}...`).start();
      try {
        await execa(`${__dirname}/../scripts/deploy-android.sh`, [track]);
      } catch (e) {
        spinner.fail('Failed');
        consola.log(e.stdout);
        process.exit(1);
      }
      spinner.succeed('Deployed!');
    });

  deploy.addCommand(ios);
  deploy.addCommand(android);
  return deploy;
};
