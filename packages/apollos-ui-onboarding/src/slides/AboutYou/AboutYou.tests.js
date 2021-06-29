import React from 'react';
import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import { Providers } from '@apollosproject/ui-test-utils';

import AboutYou from '.';

let realDateNow;

describe('The Onboarding AboutYou component', () => {
  beforeAll(() => {
    realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => ({
      setFullYear: () => null,
      getFullYear: () => 2021,
      getMonth: () => 5,
      getDate: () => 17,
    }));
    global.Date.now = dateNowStub;
  });
  afterAll(() => {
    global.Date.now = realDateNow;
  });
  it('should render', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
          setFieldValue={jest.fn()}
        />
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
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
          values={{ birthDate: '1989-02-14T05:00:00.000Z' }}
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
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
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
          setFieldValue={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
