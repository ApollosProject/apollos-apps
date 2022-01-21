import { readFileSync, readdirSync } from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import { uniq, merge } from 'lodash';
import attachEnvVariables from './attach-env-variables';
import Config from './config';

const getSharedConfig = () => {
  const configPath = `${process.env.PWD}/config/global.config.yml`;

  const envStage = process.env.ENV_STAGE ? `.${process.env.ENV_STAGE}` : '';
  const globalEnvFile = readFileSync(
    `${process.env.PWD}/config/global${envStage}.env`
  );

  const globalSecrets = dotenv.parse(globalEnvFile);
  let file;
  try {
    file = readFileSync(configPath, 'utf8');
  } catch (e) {
    throw new Error(`${configPath} does not exist`);
  }
  const globalYml = yaml.safeLoad(file);
  return attachEnvVariables(globalYml, globalSecrets).SHARED;
};

export const buildChurchConfig = ({ churchSlug, sharedConfig, configDir }) => {
  const envStage = process.env.ENV_STAGE ? `.${process.env.ENV_STAGE}` : '';
  let envFile;

  try {
    envFile = readFileSync(`${configDir}${churchSlug}${envStage}.env`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const missingFile = `"${churchSlug}${envStage}.env"`;
      // eslint-disable-next-line no-console
      console.warn(`Warning: No environment config found for ${missingFile}`);
    }

    envFile = null;
  }

  // Use `undefined` for secrets if we couldn't find a config file for this church + stage.
  // The Config data source handles what to fall back on.
  const secrets = envFile === null ? undefined : dotenv.parse(envFile);
  const config = new Config();
  config.loadYaml({
    configPath: `${configDir + churchSlug}.config.yml`,
    env: secrets,
  });
  const fullConfig = merge(config, sharedConfig);
  return fullConfig;
};

function loadConfigs() {
  if (process.env.NODE_ENV === 'test') return {};

  const configDir = `${process.env.PWD}/config/`;
  let files = [];
  let sharedConfig = {};

  files = readdirSync(configDir);
  sharedConfig = getSharedConfig();
  const churches = uniq(files.map((f) => f.split('.')[0]));

  const finalConfigs = churches.reduce((accum, curr) => {
    try {
      const fullConfig = buildChurchConfig({
        churchSlug: curr,
        sharedConfig,
        configDir,
      });
      return { ...accum, [curr]: fullConfig };
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
      return accum;
    }
  }, {});

  return finalConfigs;
}

let configs;

// used for testing
export function reloadConfigs() {
  configs = loadConfigs();
}

configs = loadConfigs();

export const fetchChurchConfig = ({ churchSlug }) => {
  if (configs[churchSlug]) {
    return configs[churchSlug];
  }
  throw Error(`Church ${churchSlug} does not have a config`);
};

export default class dataSource {
  constructor() {
    this.config = null;
  }

  initialize({ context }) {
    reloadConfigs();
    if (context?.church?.slug && configs[context.church.slug]) {
      const config = configs[context.church.slug];
      this.attachConfigToClass(config);
      this.config = config;
    }
  }

  loadJs(...args) {
    this.config.loadJs(args);
    this.attachConfigToClass(this.config);
  }

  attachConfigToClass(config) {
    Object.keys({ ...config }).forEach((key) => {
      if (key !== 'config') {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: config[key],
        });
      }
    });
  }
}
