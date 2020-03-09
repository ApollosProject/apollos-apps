import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import Config from '@apollosproject/config';
import { get } from 'lodash';

const { ROCK_MAPPINGS } = Config;

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

    const object = await this.request(model)
      .filter(filter)
      .cache({ ttl: 86400 })
      .first();

    if (object) {
      return object;
    }
    const objectId = await this.post(`/${model}`, objectAttributes);
    const ret = await this.get(`/${model}/${objectId}`);

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
        UsesSession: false,
        IsActive: true,
        ComponentEntityTypeId: entityTypeId,
        ChannelTypeMediumValueId:
          ROCK_MAPPINGS.INTERACTIONS.CHANNEL_MEDIUM_TYPE_ID,
      },
    });
  }

  async interactionComponent({ entityId, entityTypeId, entityTypeName }) {
    const channel = await this.interactionChannel({
      entityTypeId,
      entityTypeName,
    });
    return this.createOrFindInteractionComponent({
      componentName: `${
        ROCK_MAPPINGS.INTERACTIONS.COMPONENT_NAME
      } - ${entityId}`,
      channelId: channel.id,
      entityId: parseInt(entityId, 10),
    });
  }

  async interactionChannel({ entityTypeId, entityTypeName }) {
    return this.createOrFindInteractionChannel({
      channelName: `${
        ROCK_MAPPINGS.INTERACTIONS.CHANNEL_NAME
      } - ${entityTypeName}`,
      entityTypeId,
    });
  }

  // Deprecated. Use the interactionComponent method directly.
  async contentItemInteractionComponent({ contentItemId }) {
    const { id, friendlyName } = await this.modelType('ContentItem');
    return this.interactionComponent({
      entityId: contentItemId,
      entityTypeId: id,
      entityTypeName: friendlyName,
    });
  }

  // Deprecated. Use the interactionChannel method directly.
  async contentItemInteractionChannel() {
    const { id, friendlyName } = await this.modelType('ContentItem');
    return this.interactionChannel({
      entityTypeId: id,
      entityTypeName: friendlyName,
    });
  }

  mapApollosNameToRockName = (name) => {
    if (ROCK_MAPPINGS.CONTENT_ITEM[name]) {
      return ROCK_MAPPINGS.CONTENT_ITEM[name].EntityType;
    }
    return get(ROCK_MAPPINGS, `ENTITY_TYPES.${name}`, name);
  };

  async modelType(nameInput) {
    const name = this.mapApollosNameToRockName(nameInput);

    const type = await this.request('EntityTypes')
      .filter(`Name eq 'Rock.Model.${name}'`)
      .cache({ ttl: 86400 })
      .first();

    if (type) {
      return type;
    }

    return null;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { RockConstants as dataSource };
