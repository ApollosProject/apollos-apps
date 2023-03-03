import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';

import Providers from '../../Providers';

import DateInput from '.';

let realDateNow;

describe('The DateInput component', () => {
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
    const tree = renderer.create(
      <Providers>
        <DateInput
          value={moment.utc('1/1/2015').toDate()}
          maximumDate={moment.utc('1/1/2015').toDate()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a displayValue', () => {
    const tree = renderer.create(
      <Providers>
        <DateInput
          value={moment.utc('1/1/2015').toDate()}
          displayValue={moment.utc('1/1/2015').format('YYYY/MM/DD')}
          maximumDate={moment.utc('1/1/2015').toDate()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a placeholder', () => {
    const tree = renderer.create(
      <Providers>
        <DateInput
          placeholder={'mm/dd/yyyy'}
          value={moment.utc('1/1/2015').toDate()}
          maximumDate={moment.utc('1/1/2015').toDate()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a label', () => {
    const tree = renderer.create(
      <Providers>
        <DateInput
          value={moment.utc('1/1/2015').toDate()}
          displayValue={moment.utc('1/1/2015').format('YYYY/MM/DD')}
          maximumDate={moment.utc('1/1/2015').toDate()}
          label={'Date Label'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without a maximum date', () => {
    const tree = renderer.create(
      <Providers>
        <DateInput
          value={moment.utc('1/1/2015').toDate()}
          displayValue={moment.utc('1/1/2015').format('YYYY/MM/DD')}
          label={'Date Label'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with an error', () => {
    const tree = renderer.create(
      <Providers>
        <DateInput
          value={moment.utc('1/1/2015').toDate()}
          maximumDate={moment.utc('1/1/2015').toDate()}
          error={'Danger Will Robinson'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
