import fs from 'fs';
import yaml from 'js-yaml';
import attachEnvVariables from './attach-env-variables';

class Config {
  config = {
    ANALYTICS: {},
    CLOUDINARY: {},
    ROCK: {},
    ROCK_CONSTANTS: {},
  };

  loadYaml({ configPath }) {
    if (!configPath) {
      throw new Error('Config must be specifed in ApollosConfig');
    }
    let file;
    try {
      file = fs.readFileSync(configPath, 'utf8');
    } catch (e) {
      throw new Error(`${configPath} does not exist`);
    }
    this._yml = yaml.safeLoad(file);
    this.config = Object.assign(this.config, attachEnvVariables(this._yml));
    this.attachConfigToClass(this.config);
    return this;
  }

  // Allows you to do Config.PROPERTY
  // Also prevents Config.PROPERTY from being mutated (this may not be the correct behavior)
  attachConfigToClass(config) {
    Object.keys(config).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: config[key],
      });
    });
  }
}

const config = new Config();

export default config;
