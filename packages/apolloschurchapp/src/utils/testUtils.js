/* eslint-disable import/prefer-default-export */
import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo';
import wait from 'waait';

export const renderWithApolloData = async (component, mocks = []) => {
  /*
   * mocks should be in the form:
   *
   *   mocks = [
   *     {
   *       request: {
   *         query: GET_DOG_QUERY,
   *         variables: {
   *           name: 'Buck',
   *         },
   *       },
   *       result: {
   *         data: {
   *           dog: { id: '1', name: 'Buck', breed: 'bulldog' },
   *         },
   *       },
   *     },
   *   ];
   *
   */

  const tree = renderer.create(
    <MockedProvider mocks={mocks}>{component}</MockedProvider>
  );
  await wait(0);
  return tree;
};
