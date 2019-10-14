import { createGlobalId } from '@apollosproject/server-core';

export default {
  Event: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    name: (root, args, { dataSources }) => dataSources.Event.getName(root),
    description: (root, args, { dataSources }) =>
      dataSources.Event.getDescription(root),
    start: ({ schedule }, args, { dataSources }) =>
      dataSources.Event.getDateTime(schedule).start,
    end: ({ schedule }, args, { dataSources }) =>
      dataSources.Event.getDateTime(schedule).end,
    image: (root, args, { dataSources }) => dataSources.Event.getImage(root),
  },
  Campus: {
    events: ({ id }, args, { dataSources }) =>
      dataSources.Event.getByCampus(id),
  },
};
