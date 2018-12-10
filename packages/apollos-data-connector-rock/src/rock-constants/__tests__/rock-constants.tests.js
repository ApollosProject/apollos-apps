import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { dataSource as RockConstants } from '../index';
import { buildGetMock } from '../../test-utils';

ApollosConfig.loadJs({
  ROCK_MAPPINGS: {
    CONTENT_ITEM_TYPES: [
      'ContentItem',
      'UniversalContentItem',
      'DevotionalContentItem',
      'MediaContentItem',
    ],
    INTERACTIONS: {
      CHANNEL_NAME: 'Apollos App',
      COMPONENT_NAME: 'Apollos Content Item',
      CHANNEL_MEDIUM_TYPE_ID: 512,
    },
  },
});

describe('RockConstants', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  it("creates a Channel if it doesn't exist", async () => {
    const dataSource = new RockConstants();
    dataSource.modelType = buildGetMock({ id: 101 }, dataSource);
    dataSource.get = buildGetMock([[], { Id: 1 }], dataSource);
    dataSource.post = buildGetMock('1', dataSource);
    const result = await dataSource.contentItemInteractionChannel();
    expect(result).toMatchSnapshot();
    expect(dataSource.modelType.mock.calls).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls).toMatchSnapshot();
  });
  it('finds the Channel if it exists', async () => {
    const dataSource = new RockConstants();
    dataSource.get = buildGetMock([{ Id: 1 }], dataSource);
    dataSource.post = jest.fn();
    const result = await dataSource.contentItemInteractionChannel();
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls.length).toBe(0);
  });
  it("creates a Component if it doesn't exist", async () => {
    const dataSource = new RockConstants();
    dataSource.modelType = buildGetMock({ id: 101 }, dataSource);
    dataSource.get = buildGetMock([[], { Id: 1 }], dataSource);
    dataSource.post = buildGetMock('1', dataSource);
    const result = await dataSource.contentItemInteractionComponent({
      contentItemId: 7,
      contentTitle: 'Some Title',
    });
    expect(result).toMatchSnapshot();
    expect(dataSource.modelType.mock.calls).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls).toMatchSnapshot();
  });
  it('finds the Component if it exists', async () => {
    const dataSource = new RockConstants();
    dataSource.get = buildGetMock([{ Id: 1 }], dataSource);
    dataSource.post = jest.fn();
    const result = await dataSource.contentItemInteractionComponent({
      contentItemId: 7,
      contentTitle: 'Some Title',
    });
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls.length).toBe(0);
  });
  it('finds a ContentItem model ID', async () => {
    const dataSource = new RockConstants();
    dataSource.get = buildGetMock([{ Id: 1 }], dataSource);
    const result = await dataSource.modelType('ContentItem');
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
  it('finds a UniversalContentItem model ID', async () => {
    const dataSource = new RockConstants();
    dataSource.get = buildGetMock([{ Id: 1 }], dataSource);
    const result = await dataSource.modelType('UniversalContentItem');
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
  it('Throws when finding an unknown model ', () => {
    const dataSource = new RockConstants();
    dataSource.get = buildGetMock([{ Id: 1 }], dataSource);
    const prom = dataSource.modelType('IDontExist');
    expect(prom).rejects.toEqual(
      new Error('IDontExist has not been mapped into a Rock type!')
    );
  });
  it('Returns null if model type not found ', async () => {
    const dataSource = new RockConstants();
    dataSource.get = buildGetMock([], dataSource);
    const result = await dataSource.modelType('ContentItem');
    expect(result).toEqual(null);
  });
});
