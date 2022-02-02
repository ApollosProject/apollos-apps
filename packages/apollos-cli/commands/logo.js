import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import canvas from 'canvas';
import prompts from 'prompts';
import { execa } from 'execa';

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

const createIOSIcon = async (logoPath) => {
  const splash = createCanvas(1024, 1024);
  const ctx = splash.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect = (0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 62, 62, 900, 900);
  const buffer = splash.toBuffer('image/png');
  const tmpobj = tmp.fileSync();
  fs.writeFileSync(tmpobj.name, buffer);
  return tmpobj.name;
};

const createAndroidIcon = async (logoPath) => {
  const splash = createCanvas(1024, 1024);
  const ctx = splash.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect = (0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 262, 262, 500, 500);
  const buffer = splash.toBuffer('image/png');
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
  ];

  (async () => {
    const response = await prompts(questions);
    if (Object.keys(response).length === 1) {
      const safePath = path.normalize(response.logoPath);
      const splash = await createSplash(safePath);
      const ios = await createIOSIcon(safePath);
      const android = await createAndroidIcon(safePath);
      try {
        await execa('node_modules/.bin/react-native', [
          'set-splash',
          '--path',
          splash,
        ]);
        await execa('node_modules/.bin/react-native', [
          'set-icon',
          '--path',
          ios,
          '--platform',
          'ios',
        ]);
        await execa('node_modules/.bin/react-native', [
          'set-icon',
          '--path',
          android,
          '--platform',
          'android',
        ]);
      } catch (e) {
        console.log(e);
      }
    }
  })();
  createSplash();
};
