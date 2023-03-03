const fs = require('fs');
const canvas = require('canvas');

const { createCanvas, loadImage } = canvas;

const createSplash = async () => {
  const splash = createCanvas(2000, 3000);
  const ctx = splash.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect = (0, 0, 2000, 3000);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 750, 1250, 500, 500);
  const buffer = splash.toBuffer('image/png');
  fs.writeFileSync(`${workDir}/splash.png`, buffer);
};

const createRNIcon = async () => {
  const icon = createCanvas(1024, 1024);
  const ctx = icon.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 112, 112, 800, 800);
  const buffer = icon.toBuffer('image/png');
  fs.writeFileSync(`${workDir}/rn-icon.png`, buffer);
};

const createIOSIcon = async () => {
  const icon = createCanvas(1024, 1024);
  const ctx = icon.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 112, 112, 800, 800);
  const buffer = icon.toBuffer('image/png');
  fs.writeFileSync(`${workDir}/ios.png`, buffer);
};

const createAndroidIcon = async () => {
  const icon = createCanvas(1024, 1024);
  const ctx = icon.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 1024, 1024);

  const image = await loadImage(logoPath);
  ctx.drawImage(image, 262, 262, 500, 500);
  const buffer = icon.toBuffer('image/png');
  fs.writeFileSync(`${workDir}/android.png`, buffer);
};

const createOnesignalIcons = async () => {
  const logo = await loadImage(logoPath);
  const makeIcon = (size) => {
    const [px, folder] = size;
    const icon = createCanvas(px, px);
    const ctx = icon.getContext('2d');
    ctx.drawImage(logo, 0, 0, px, px);
    const buffer = icon.toBuffer('image/png');
    fs.writeFileSync(
      `android/app/src/main/res/drawable-${folder}/ic_stat_onesignal_default.png`,
      buffer
    );
  };
  [
    [24, 'mdpi'],
    [36, 'hdpi'],
    [48, 'xhdpi'],
    [72, 'xxhdpi'],
    [96, 'xxxhdpi'],
  ].forEach((size) => {
    makeIcon(size);
  });
};

const workDir = process.argv[2];
const logoPath = process.argv[3];
const bgColor = process.argv[4];

createSplash();
createRNIcon();
createIOSIcon();
createAndroidIcon();
createOnesignalIcons();
