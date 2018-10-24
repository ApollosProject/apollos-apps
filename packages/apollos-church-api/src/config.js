import path from 'path';
import ApollosConfig from '@apollos/config';
import { setRockVariables } from 'apollos-rock-apollo-data-source';

const { config } = new ApollosConfig({
  configPath: path.join(__dirname, '..', 'config.yml'),
});

setRockVariables({
  url: config.ROCK.API_URL,
  token: config.ROCK.API_TOKEN,
});

const {
  CLOUDINARY,
  ROCK,
  ANALYTICS,
  BIBLE_API,
  ROCK_MAPPINGS,
  ROCK_CONSTANTS,
} = config;

export default config;
export {
  CLOUDINARY,
  ROCK,
  ANALYTICS,
  BIBLE_API,
  ROCK_MAPPINGS,
  ROCK_CONSTANTS,
};
