// const blacklist = require('metro-config/src/defaults/blacklist');
//
// module.exports = {
//   resolver: {
//     blacklistRE: blacklist([
//       /node_modules\/.*\/node_modules\/react-native\/.*/,
//       /node_modules\/.*\/node_modules\/react-native-linear-gradient\/.*/,
//       /node_modules\/.*\/node_modules\/react-native-svg\/.*/,
//     ])
//   },
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
// };

const {
    applyConfigForLinkedDependencies,
} = require('@carimus/metro-symlinked-deps');

module.exports = applyConfigForLinkedDependencies(
    {
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: false,
                },
            }),
        },
    },
    {
        projectRoot: __dirname,
        blacklistLinkedModules: [
            'react',
            'react-native',
            'react-native-linear-gradient',
            'react-native-svg',
            'react-native-safe-area-context',
            'react-native-gesture-handler',
            '@storybook'
        ],
        resolveNodeModulesAtRoot: true,
    },
);