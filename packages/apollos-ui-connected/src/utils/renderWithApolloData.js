/* eslint-disable import/prefer-default-export */
import renderer from 'react-test-renderer';
import wait from 'waait';

const renderWithApolloData = async (component) => {
  const tree = renderer.create(component);
  await wait(1);
  tree.update(component);
  return tree;
};

export default renderWithApolloData;
