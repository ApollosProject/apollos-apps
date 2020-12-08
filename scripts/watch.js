const { exec } = require('child_process');
const chokidar = require('chokidar');

console.log('Watching for changes');
chokidar
  .watch(['packages/**'], {
    ignored: ['**/node_modules/**', '**/lib/**', '*.html', '*.snap'],
  })
  .on('change', (fullPath) => {
    const pkg = fullPath.split('/')[1].replace('apollos-', '@apollosproject/');
    exec(`yarn lerna run build --scope ${pkg}`, (err, stdout, stderr) => {
      if (err) {
        console.log(`Error building ${pkg}`, err);
      } else {
        console.log(stdout, stderr);
        console.log(`yarn lerna --scope ${pkg} exec -- yalc push`);
        exec(
          `./node_modules/lerna/cli.js --scope ${pkg} exec -- yalc push --changed`,
          (err, stdout, stderr) => {
            if (err) {
              console.log(`Error building ${pkg}`, err);
            } else {
              console.log(stdout, stderr);
            }
          }
        );
      }
    });
  });
