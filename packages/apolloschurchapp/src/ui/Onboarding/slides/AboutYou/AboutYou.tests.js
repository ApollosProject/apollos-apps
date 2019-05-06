import React from 'react';
import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import Providers from 'apolloschurchapp/src/Providers';

import AboutYou from '.';

describe('The Onboarding AboutYou component', () => {
  it('should render', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou defaultDate={'2019-02-14'} setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          slideTitle={'Custom title text'}
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          description={'Custom description text'}
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom gender list', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          genderList={['M', 'F']}
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render the selected gender', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          values={{ gender: 'Male' }}
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a selected birthdate', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou
          values={{ birthDate: '1989-02-14' }}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with errors', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou
          touched={{
            gender: true,
            birthDate: true,
          }}
          errors={{
            gender: 'Gender errors',
            birthDate: 'BirthDate errors',
          }}
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          BackgroundComponent={
            <GradientOverlayImage
              source={'https://picsum.photos/640/640/?random'}
            />
          }
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          onPressPrimary={jest.fn()}
          defaultDate={'2019-02-14'}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
