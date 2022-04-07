import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import canvas from 'canvas';
import prompts from 'prompts';
import { execa } from 'execa';
import consola from 'consola';
import ora from 'ora';

const { createCanvas, loadImage } = canvas;

const createSplash = async (logoPath) => {
  const splash = createCanvas(2000, 3000);
  const ctx = splash.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect = (0, 0, 2000, 3000);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 750, 1250, 500, 500);
  const buffer = splash.toBuffer('image/png');
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, buffer);
  return tmpobj.name;
};

const createIOSIcon = async (logoPath, bgColor) => {
  const icon = createCanvas(1024, 1024);
  const ctx = icon.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 62, 62, 900, 900);
  const buffer = icon.toBuffer('image/png');
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, buffer);
  return tmpobj.name;
};

const createAndroidIcon = async (logoPath, bgColor) => {
  const icon = createCanvas(1024, 1024);
  const ctx = icon.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 262, 262, 500, 500);
  const buffer = icon.toBuffer('image/png');
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, buffer);
  return tmpobj.name;
};

export default () => {
  const questions = [
    {
      type: 'text',
      name: 'logoPath',
      message: 'Logo file path?',
      validate: (value) =>
        fs.existsSync(path.normalize(value)) || "File doesn't exist!",
    },
    {
      type: 'text',
      name: 'iconBGColor',
      message: 'Icon background color?',
      initial: '#FFFFFF',
      validate: (value) =>
        value.match(/#[a-fA-F0-9]{6}/) || 'Must be a hex color!',
    },
    {
      type: 'text',
      name: 'splashBGColor',
      message: 'Splash screen background color?',
      initial: '#FFFFFF',
      validate: (value) =>
        value.match(/#[a-fA-F0-9]{6}/) || 'Must be a hex color!',
    },
  ];

  (async () => {
    const response = await prompts(questions);
    if (Object.keys(response).length === questions.length) {
      const safePath = path.normalize(response.logoPath);
      const splash = await createSplash(safePath);
      const ios = await createIOSIcon(safePath, response.iconBGColor);
      const android = await createAndroidIcon(safePath, response.iconBGColor);
      const spinner = ora(`Generating splash screen...`).start();
      try {
        await execa('node_modules/.bin/react-native', [
          'set-splash',
          '--path',
          splash,
          '--background',
          response.splashBGColor,
        ]);
        spinner.text = 'Generating iOS icon...';
        await execa('node_modules/.bin/react-native', [
          'set-icon',
          '--path',
          ios,
          '--platform',
          'ios',
        ]);
        spinner.text = 'Generating Android icon...';
        await execa('node_modules/.bin/react-native', [
          'set-icon',
          '--path',
          android,
          '--platform',
          'android',
        ]);
      } catch (e) {
        spinner.fail('Failed');
        consola.error(e);
      }
      spinner.succeed('Success!');
    }
  })();
};
