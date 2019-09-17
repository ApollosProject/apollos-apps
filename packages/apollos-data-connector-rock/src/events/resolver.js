import { createGlobalId } from '@apollosproject/server-core';

export default {
  Event: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    name: (root, args, { dataSources }) => dataSources.Events.getName(root),
    start: ({ schedule }, args, { dataSources }) => {
      const times = dataSources.Events.getDateTime(schedule);
      return times.start;
    },
    end: ({ schedule }, args, { dataSources }) => {
      const times = dataSources.Events.getDateTime(schedule);
      return times.end;
    },
  },
  Campus: {
    events: ({ id }, args, { dataSources }) =>
      dataSources.Events.getByCampus(id),
  },
};
