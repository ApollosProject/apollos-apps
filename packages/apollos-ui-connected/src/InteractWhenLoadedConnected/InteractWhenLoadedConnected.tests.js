import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import InteractWhenLoadedConnected from '.';

describe('The InteractWhenLoadedConnected component', () => {
  it('should render with isLoading=false', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider}>
        <InteractWhenLoadedConnected
          isLoading={false}
          action="COMPLETE"
          nodeId="UniversalContentItem:123"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render with isLoading=true', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider}>
        <InteractWhenLoadedConnected
          isLoading
          action="COMPLETE"
          nodeId="UniversalContentItem:123"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
