import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import CampusCard from '.';

describe('CampusCard', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard
          title={'Cameron Poe'}
          description={
            '"Why couldn\'t you just put the Bunny back in the box?"'
          }
          images={['https://www.placecage.com/c/250/250']}
          category=""
          distance={2037.6461577685534}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard
          title={'Stanley Goodspeed'}
          description={
            '"How… In the name of Zeus\'s BUTTHOLE, did you get out of your cell?"'
          }
          images={['https://www.placecage.com/c/250/250']}
          category=""
          distance={2037.6461577685534}
          isLoading
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
