import path from 'path';
import ApollosConfig from '@apolloschurch/config';

ApollosConfig.loadYaml({
  configPath: path.join(__dirname, '..', 'config.yml'),
});

// setRockVariables({
//   url: config.ROCK.API_URL,
//   token: config.ROCK.API_TOKEN,
// });

// const {
//   CLOUDINARY,
//   ROCK,
//   ANALYTICS,
//   BIBLE_API,
//   ROCK_MAPPINGS,
//   ROCK_CONSTANTS,
// } = config;

// export default config;
// export {
//   CLOUDINARY,
//   ROCK,
//   ANALYTICS,
//   BIBLE_API,
//   ROCK_MAPPINGS,
//   ROCK_CONSTANTS,
// };
