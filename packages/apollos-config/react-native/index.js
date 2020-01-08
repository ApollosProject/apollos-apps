import NativeConfig from 'react-native-config';

class Config {
  config = {
    ...NativeConfig,
  };

  constructor() {
    this.attachConfigToClass(this.config);
  }

  loadJs(data = {}) {
    Object.keys(data).forEach((key) => {
      if (this.config[key] && typeof this.config[key] === 'object') {
        // Deep merge defaults if they exist.
        this.config[key] = Object.assign(this.config[key], data[key]);
      } else {
        // Otherwise attach results to config.
        this.config[key] = data[key];
      }
    });
    this.attachConfigToClass(this.config);
  }

  // Allows you to do Config.PROPERTY
  attachConfigToClass(config) {
    Object.keys(config).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: config[key],
      });
    });
  }
}

const config = new Config();

export default config;
