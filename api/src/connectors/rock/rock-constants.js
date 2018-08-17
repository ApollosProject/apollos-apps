/* eslint-disable no-console */
import RockApolloDataSource from '/api/connectors/rock/data-source';

const mapApollosNameToRockName = (name) => {
  switch (name) {
    case 'ContentItem':
    case 'UniversalContentItem':
      return 'ContentChannelItem';
    default:
      throw new Error(`${name} has not been mapped into a Rock type!`);
  }
};

const RockConstantCache = new Map();
export default class RockConstants extends RockApolloDataSource {
  async findOrCreate({ model, objectAttributes }) {
    // Turns {ChannelId: 7, Name: 'Something'} into '(ChannelId eq 7) and (Name eq 'Something')'
    const filter = Object.keys(objectAttributes)
      .map((key) => {
        if (typeof objectAttributes[key] === 'string') {
          return `(${key} eq '${objectAttributes[key]}')`;
        }
        return `(${key} eq ${objectAttributes[key]})`;
      })
      .join(' and ');

    const objects = await this.request(model)
      .filter(filter)
      .get();
    if (objects.length) {
      console.log('Found', objects[0]);
      return objects[0];
    }
    const objectId = await this.post(`/${model}`, objectAttributes);
    const ret = await this.get(`/${model}/${objectId}`);
    console.log('Created', ret);
    return ret;
  }

  async createOrFindInteractionComponent({ componentName, channelId }) {
    return this.findOrCreate({
      model: 'InteractionComponents',
      objectAttributes: { Name: componentName, ChannelId: channelId },
    });
  }

  async createOrFindInteractionChannel({ channelName }) {
    return this.findOrCreate({
      model: 'InteractionChannels',
      objectAttributes: { Name: channelName, UsesSession: true },
    });
  }

  async interactionChannel() {
    if (RockConstantCache.has('interactionChannel')) {
      return RockConstantCache.get('interactionChannel');
    }
    const channel = await this.createOrFindInteractionChannel({
      channelName: 'Apollos App',
    });
    RockConstantCache.set('InteractionChannel', channel);
    return channel;
  }

  async interactionComponent() {
    if (RockConstantCache.has('InteractionComponent')) {
      return RockConstantCache.get('InteractionComponent');
    }
    const channel = await this.interactionChannel();
    const component = await this.createOrFindInteractionComponent({
      componentName: 'Apollos Content Item',
      channelId: channel.id,
    });
    RockConstantCache.set('InteractionComponent', component);
    return component;
  }

  async modelTypeId(nameInput) {
    const name = mapApollosNameToRockName(nameInput);
    const cacheKey = `type:${name}`;

    if (RockConstantCache.has(cacheKey)) {
      return RockConstantCache.get(cacheKey);
    }
    const types = await this.request('EntityTypes')
      .filter(`Name eq 'Rock.Model.${name}'`)
      .get();
    if (types.length) {
      // eslint-disable-next-line prefer-destructuring
      RockConstantCache.set(cacheKey, types[0]);
      return types[0];
    }

    return null;
  }
}
