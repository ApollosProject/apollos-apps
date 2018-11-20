import { createGlobalId } from '@apollosproject/server-core';

export default {
  Query: {
    group: (root, { id }, { dataSources }) => {
      return !id ? 
        false :
        dataSources.Group.getFromId(id);
    },
    groups: (root, { }, { dataSources }) => dataSources.Group.getGroups(),
  },
  Mutation: {
    
  },
  Group: {
    id:
      ({ id }, args, context, { parentType }) => 
        createGlobalId(id, parentType.name),

    /**
     * If Group doesn't have a ParentGroupId, Rock returns { }, not null
     */
    parentGroupId:      
      ({ parentGroupId })   => 
        (typeof parentGroupId === 'number' ? parentGroupId : null),
    
    name:               
      ({ name }) => 
        (typeof name === null ? '' : name),
    
    description:        
      ({ description }) => 
        (typeof description === null ? '' : description),
    
    childGroups:
      ({ id }, args, { dataSources }) =>
        (typeof id === null) ? 
          [] : dataSources.Group.getChildrenFromParentId(id),
  },
};
