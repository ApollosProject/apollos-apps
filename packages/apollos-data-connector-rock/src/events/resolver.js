import { createGlobalId } from '@apollosproject/server-core';

export default {
  Event: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    name: ({ eventItemId: id }, args, { dataSources }) =>
      dataSources.Events.getName(id),
    start: async ({ scheduleId: id }, args, { dataSources }) => {
      const times = await dataSources.Events.getDateTime(id);
      return times.start;
    },
    end: async ({ scheduleId: id }, args, { dataSources }) => {
      const times = await dataSources.Events.getDateTime(id);
      return times.end;
    },
  },
  Campus: {
    events: ({ id }, args, { dataSources }) =>
      dataSources.Events.getByCampus(id),
  },
};
