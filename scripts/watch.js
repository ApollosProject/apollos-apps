const { exec } = require('child_process');
const chokidar = require('chokidar');

console.log('Watching for changes');
chokidar
  .watch('packages/apollos-data-*/**', {
    ignored: ['**/node_modules/**', '**/lib/**', '*.html', '*.snap'],
  })
  .on('change', (fullPath) => {
    const pkg = fullPath.split('/')[1].replace('apollos-', '@apollosproject/');
    exec(
      `yarn lerna run build --scope apollos-church-api --scope ${pkg}`,
      (err, stdout, stderr) => {
        if (err) {
          console.log(`Error building ${pkg}`);
          console.error(err);
        }
        console.log(stdout);
        console.log(stderr);
      }
    );
  });
