import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import Config from '@apollosproject/config';

const { ROCK_MAPPINGS } = Config;

const mapApollosNameToRockName = (name) => {
  if (ROCK_MAPPINGS.CONTENT_ITEM_TYPES.includes(name)) {
    return 'ContentChannelItem';
  }
  throw new Error(`${name} has not been mapped into a Rock type!`);
};

class RockConstants extends RockApolloDataSource {
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
      .cache({ ttl: 86400 })
      .get();
    if (objects.length) {
      return objects[0];
    }
    const objectId = await this.post(`/${model}`, objectAttributes);
    const ret = await this.get(`/${model}/${objectId}`);
    console.log('Created', ret);
    return ret;
  }

  async createOrFindInteractionComponent({
    componentName,
    channelId,
    entityId,
  }) {
    return this.findOrCreate({
      model: 'InteractionComponents',
      objectAttributes: {
        Name: componentName,
        ChannelId: channelId,
        EntityId: entityId,
      },
    });
  }

  async createOrFindInteractionChannel({ channelName, entityTypeId }) {
    return this.findOrCreate({
      model: 'InteractionChannels',
      objectAttributes: {
        Name: channelName,
        UsesSession: true,
        IsActive: true,
        ComponentEntityTypeId: entityTypeId,
        ChannelTypeMediumValueId:
          ROCK_MAPPINGS.INTERACTIONS.CHANNEL_MEDIUM_TYPE_ID,
      },
    });
  }

  async contentItemInteractionComponent({ contentItemId, contentName = null }) {
    const channel = await this.contentItemInteractionChannel();
    return this.createOrFindInteractionComponent({
      componentName: `${
        ROCK_MAPPINGS.INTERACTIONS.COMPONENT_NAME
      } - ${contentName || contentItemId}`,
      channelId: channel.id,
      entityId: parseInt(contentItemId, 10),
    });
  }

  async contentItemInteractionChannel() {
    const { id } = await this.modelType('ContentItem');
    return this.createOrFindInteractionChannel({
      channelName: ROCK_MAPPINGS.INTERACTIONS.CHANNEL_NAME,
      entityTypeId: id,
    });
  }

  async modelType(nameInput) {
    const name = mapApollosNameToRockName(nameInput);

    const types = await this.request('EntityTypes')
      .filter(`Name eq 'Rock.Model.${name}'`)
      .cache({ ttl: 86400 })
      .get();
    if (types.length) {
      return types[0];
    }

    return null;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { RockConstants as dataSource };
