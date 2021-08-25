import { parseGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import { get } from 'lodash';
import { PostgresDataSource } from '../postgres';

export default class Interactions extends PostgresDataSource {
  modelName = 'interaction';

  ADDITIONAL_INTERACTIONS_MAP = {
    ContentItem: {
      COMPLETE: this.updateSeriesStarted.bind(this),
    },
    PrayerRequest: {
      PRAY: this.incrementPrayer.bind(this),
    },
  };

  async incrementPrayer({ id }) {
    const { PrayerRequest } = this.context.dataSources;
    return PrayerRequest.incrementPrayed(id);
  }

  async updateSeriesStarted({ id }) {
    const { ContentItem } = this.context.dataSources;

    const model = await ContentItem.getFromId(id);
    const parent = await model.getParent();

    if (parent) {
      // Check to see if we have started the series before
      const nodeId = parent.apollosId;
      const otherInteractions = await this.getInteractionsForCurrentUserAndNodes(
        {
          nodeIds: [nodeId],
          actions: ['SERIES_START'],
        }
      );
      // If we haven't, mark it as started
      if (!otherInteractions.length) {
        await this.createNodeInteraction({
          nodeId,
          action: 'SERIES_START',
          additional: false, // we pass this prop to avoid recursive interaction creation
        });
      }
    }
  }

  async createAdditionalInteractions({ id, __type, action }) {
    // Get all the typenames for an entity.
    // This will likely be something like, [UniversalContentItem, ContentItem]
    const normalizedTypeNames = this.context.models.Node.getPossibleDataModels({
      schema: this.context.schema,
      __type,
    });
    // For each of this types
    return Promise.all(
      normalizedTypeNames.map(async (normalizedType) => {
        // do we have a function to call?
        const possibleFunction = get(
          this.ADDITIONAL_INTERACTIONS_MAP,
          `${normalizedType}.${action}`
        );
        // if so, call it.
        if (possibleFunction) {
          return possibleFunction({ id, __type, action });
        }
        return null;
      })
    );
  }

  async getInteractionsForCurrentUserAndNodes({ nodeIds, actions = [] } = {}) {
    let currentPersonId;
    try {
      currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    } catch (e) {
      return [];
    }

    if (nodeIds.length === 0) {
      return [];
    }

    return this.model.findAll({
      where: {
        personId: currentPersonId,
        ...(actions.length ? { action: actions } : {}),
      },
      include: [
        {
          model: this.sequelize.models.contentItem,
          where: { apollosId: nodeIds },
          required: true,
        },
      ],
    });
  }

  async getInteractionsForCurrentUser({ actions = [] } = {}) {
    let currentPersonId;
    try {
      currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    } catch (e) {
      console.log(e, { currentPersonId });
      return [];
    }

    return this.model.findAll({
      where: {
        personId: currentPersonId,
        ...(actions.length ? { action: actions } : {}),
      },
    });
  }

  async createNodeInteraction({
    nodeId,
    action,
    additional = true,
    awaitAdditional = false,
  }) {
    const { id, __type } = parseGlobalId(nodeId);

    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();

    let entityType = __type;
    if (ApollosConfig?.CONTENT?.TYPES?.includes(__type)) {
      entityType = 'ContentItem';
    }

    await this.model.create({
      personId: currentPersonId,
      nodeType: entityType,
      nodeId: id,
      action,
    });

    if (additional) {
      const additionalFuncs = this.createAdditionalInteractions({
        id,
        __type,
        action,
      });

      // Primarily used in testing.
      // Most of the time, we don't want to wait for this code to return.
      if (awaitAdditional) {
        await additionalFuncs;
      }
    }

    return {
      success: true,
      nodeId,
    };
  }
}
