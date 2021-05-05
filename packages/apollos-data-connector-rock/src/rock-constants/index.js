import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import { get } from 'lodash';

const { ROCK_MAPPINGS } = ApollosConfig;

class RockConstants extends RockApolloDataSource {
  async findOrCreate({ model, objectAttributes }) {
    // Turns {ChannelId: 7, Name: 'Something'} into '(ChannelId eq 7) and (Name eq 'Something')'
    const { Cache } = this.context.dataSources;

    const cacheKey = ['rockConstants', model, JSON.stringify(objectAttributes)];
    const cachedObj = await Cache.get({ key: cacheKey });

    // If we have a cached object, return it.
    if (cachedObj) {
      return JSON.parse(cachedObj);
    }

    // If we don't have a cached object create a filter out of the attributes of the expected objects.
    const filter = Object.keys(objectAttributes)
      .map((key) => {
        if (typeof objectAttributes[key] === 'string') {
          return `(${key} eq '${objectAttributes[key]}')`;
        }
        return `(${key} eq ${objectAttributes[key]})`;
      })
      .join(' and ');

    // Look for objects matching that filter.
    const object = await this.request(model).filter(filter).first();

    // if we have one
    if (object) {
      // cache it
      await Cache.set({ key: cacheKey, data: JSON.stringify(object) });
      // and return it.
      return object;
    }

    // Otherwise, if no object matching the `objectAttributes` exists, create it.
    const objectId = await this.post(`/${model}`, objectAttributes);
    // Go grab the newly created object
    const ret = await this.get(`/${model}/${objectId}`);
    // Cache it
    await Cache.set({ key: cacheKey, data: JSON.stringify(ret) });

    // And return it.
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
        // https://www.rockrms.com/ReleaseNotes#v11.0-core
        ...(ApollosConfig?.ROCK?.VERSION < 11.0
          ? { ChannelId: channelId }
          : { InteractionChannelId: channelId }),
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
          ROCK_MAPPINGS.INTERACTIONS.CHANNEL_MEDIUM_TYPE_ID || 512, // 512 is mobile app
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
        ROCK_MAPPINGS.INTERACTIONS.COMPONENT_NAME || 'Apollos App Component'
      } - ${entityId}`,
      channelId: channel.id,
      entityId: parseInt(entityId, 10),
    });
  }

  async interactionChannel({ entityTypeId, entityTypeName }) {
    return this.createOrFindInteractionChannel({
      channelName: `${
        ROCK_MAPPINGS.INTERACTIONS.CHANNEL_NAME || 'Apollos App'
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
