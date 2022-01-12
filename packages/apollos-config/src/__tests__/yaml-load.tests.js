import path from 'path';
import Config from '../index';

describe('the yaml loader', () => {
  it('must load variables from a yaml', () => {
    process.env.ROCK_TOKEN = 'some-rock-token';
    process.env.SOME_VALUE = 'this is a value';
    process.env.ANOTHER_VALUE = 'this is another value';
    process.env.CONTENT_ID_FROM_ENV = 10;
    process.env.AN_ARRAY_OF_STRINGS = '["APPROVED", "DENIED"]';

    Config.loadYaml({
      configPath: path.join(__dirname, 'test.yml'),
    });
    expect(Config.ROCK.API_TOKEN).toEqual(process.env.ROCK_TOKEN);
    expect(Config.config).toMatchSnapshot();
  });
  it('must fail if no config is present', () => {
    expect(() => Config.loadYaml({})).toThrow(Error);
  });
  it('must fail if config path is invalid', () => {
    expect(() => Config.loadYaml({ configPath: './fake.yml' })).toThrow(Error);
  });
});
