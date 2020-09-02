import React from 'react';
import { Providers, renderWithApolloData } from '../testUtils';
import InteractWhenLoadedConnected from '.';

describe('The InteractWhenLoadedConnected component', () => {
  it('should render with isLoading=false', async () => {
    const tree = await renderWithApolloData(
      <Providers>
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
      <Providers>
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
