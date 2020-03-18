import React from 'react';
import { Providers, renderWithApolloData } from '../utils/testUtils';
import InteractWhenLoadedConnected from '.';

describe('The InteractWhenLoadedConnected component', () => {
  it('should render with loaded=true', async () => {
    const tree = await renderWithApolloData(
      <Providers>
        <InteractWhenLoadedConnected
          loaded
          action="COMPLETE"
          nodeId="UniversalContentItem:123"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render with loading=false', async () => {
    const tree = await renderWithApolloData(
      <Providers>
        <InteractWhenLoadedConnected
          loaded={false}
          action="COMPLETE"
          nodeId="UniversalContentItem:123"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
