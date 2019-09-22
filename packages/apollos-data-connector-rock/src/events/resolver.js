import { createGlobalId } from '@apollosproject/server-core';

export default {
  Event: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    name: (root, args, { dataSources }) => dataSources.Events.getName(root),
    start: ({ schedule }, args, { dataSources }) =>
      dataSources.Events.getDateTime(schedule).start,
    end: ({ schedule }, args, { dataSources }) =>
      dataSources.Events.getDateTime(schedule).end,
  },
  Campus: {
    events: ({ id }, args, { dataSources }) =>
      dataSources.Events.getByCampus(id),
  },
};
