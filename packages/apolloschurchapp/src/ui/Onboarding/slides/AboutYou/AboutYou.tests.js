import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';

import Providers from 'apolloschurchapp/src/Providers';

import AboutYou from '.';

describe('The Onboarding AboutYou component', () => {
  it('should render', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou defaultDate={moment.utc('2019-02-14').toDate()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom image', () => {
    /* we have to pass in a date via defaultDate or the DateInput component will create a current date
     * object and invalidate the snapshots every time. */
    const tree = renderer.create(
      <Providers>
        <AboutYou
          imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }}
          defaultDate={moment.utc('2019-02-14').toDate()}
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
          defaultDate={moment.utc('2019-02-14').toDate()}
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
          defaultDate={moment.utc('2019-02-14').toDate()}
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
          defaultDate={moment.utc('2019-02-14').toDate()}
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
          userGender={'Male'}
          defaultDate={moment.utc('2019-02-14').toDate()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom date picker', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou userDOB={moment.utc('1989-02-14').toDate()} />
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
          defaultDate={moment.utc('2019-02-14').toDate()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
