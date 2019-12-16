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
  it('should render with just a title', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard title={'Edward Malus'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without a distance', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard
          title={'Johnny Blaze'}
          description={'"He may have my soul but he doesn\'t have my spirit."'}
          images={['https://www.placecage.com/c/250/250']}
          category=""
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without an image', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard
          title={'Benjamin Franklin Gates'}
          description={'"You hungry?"'}
          category=""
          distance={2037.6461577685534}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without a description', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard
          title={'Cris Johnson'}
          images={['https://www.placecage.com/c/250/250']}
          category=""
          distance={2037.6461577685534}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a title and description', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard title={'Damon Macready'} description={'"Oh, child..."'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a title and image', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard
          title={'Castor Troy'}
          images={['https://www.placecage.com/c/250/250']}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a title and distance', () => {
    const tree = renderer.create(
      <Providers>
        <CampusCard title={'Memphis Raines'} distance={2037.6461577685534} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
