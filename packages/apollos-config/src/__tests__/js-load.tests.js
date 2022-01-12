import Config from '../index';

describe('the js loader', () => {
  it('must load variables from a js object', () => {
    Config.loadJs({
      ROCK: {
        API_URL: 'https://some-url.com',
      },
      BIBLE_API: {
        API_TOKEN: 'foobar',
      },
      VALUE_NOT_IN_DEFAULT_CONFIG: {
        FOO: 'bar',
      },
    });
    expect(Config.config).toMatchSnapshot();
  });
  it('must load empty config', () => {
    Config.loadJs({});
    expect(Config.config).toMatchSnapshot();
  });
  it('must load empty config with no arguments', () => {
    Config.loadJs();
    expect(Config.config).toMatchSnapshot();
  });
});
