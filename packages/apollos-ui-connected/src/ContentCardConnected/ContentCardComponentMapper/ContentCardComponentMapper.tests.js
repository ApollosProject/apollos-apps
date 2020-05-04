import React from 'react';
import renderer from 'react-test-renderer';

import { DefaultCard } from '@apollosproject/ui-kit';

import { Providers } from '../../utils/testUtils';

import ContentCardComponentMapper from '.';

describe('The CampaignItemListFeature component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>{ContentCardComponentMapper()}</Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a Component prop', () => {
    const tree = renderer.create(
      <Providers>
        <ContentCardComponentMapper Component={DefaultCard} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
