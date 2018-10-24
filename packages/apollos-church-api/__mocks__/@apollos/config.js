const config = {
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
  CLOUDINARY: {
    URL: null,
  },
  BIBLE_API: {
    KEY: null,
  },
  ANALYTICS: {},
  ROCK_CONSTANTS: {
    IMAGE: 10,
    AUDIO_FILE: 77,
    VIDEO_FILE: 79,
  },
};

export function setConfig(newConfig) {
  Object.keys(config).forEach((key) => {
    if (newConfig[key]) {
      config[key] = Object.assign(config[key], newConfig[key]);
    }
  });
}

class Config {
  constructor() {
    return { config };
  }
}
export default Config;
