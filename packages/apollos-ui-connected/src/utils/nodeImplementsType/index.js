import ApollosConfig from '@apollosproject/config';

const getType = (nodeId) => (nodeId ? nodeId.split(':')[0] : '');

const nodeImplementsType = (nodeId, type) =>
  ApollosConfig?.TYPEMAP[getType(nodeId)]?.includes(type);

export default nodeImplementsType;
