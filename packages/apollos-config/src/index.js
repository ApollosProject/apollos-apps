import fs from 'fs';
import yaml from 'js-yaml';
import attachEnvVariables from './attach-env-variables';

export default class Config {
  constructor({ configPath }) {
    if (!configPath) {
      throw new Error('Config must be specifed in ApollosConfig');
    }
    let file;
    try {
      file = fs.readFileSync(configPath, 'utf8');
    } catch (e) {
      console.log(e);
      throw new Error(`${configPath} does not exist`);
    }
    this._yml = yaml.safeLoad(file);
    this.config = attachEnvVariables(this._yml);
    return this;
  }
}
