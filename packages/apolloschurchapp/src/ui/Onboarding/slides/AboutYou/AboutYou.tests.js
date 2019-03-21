import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import AboutYou from '.';

describe('The Onboarding AboutYou component', () => {
  it('should render', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou defaultDate={new Date('2019-02-14')} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom image', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }}
          defaultDate={new Date('2019-02-14')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          slideTitle={'Custom title text'}
          defaultDate={new Date('2019-02-14')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          description={'Custom description text'}
          userDOB={new Date('1989-02-14')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render custom gender list', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          genderList={['M', 'F']}
          defaultDate={new Date('2019-02-14')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render selected gender', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou userGender={'Male'} defaultDate={new Date('2019-02-14')} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should check when invalid gender is passed', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          genderList={['M', 'F']}
          userGender={'Male'}
          defaultDate={new Date('2019-02-14')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render custom date picker', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou userDOB={new Date('1989-02-14')} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    /* we have to pass in a date via userDOB or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          onPressPrimary={jest.fn()}
          defaultDate={new Date('2019-02-14')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
