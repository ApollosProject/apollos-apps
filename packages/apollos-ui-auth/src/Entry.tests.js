import React from 'react';
import renderer from 'react-test-renderer';
import { Platform } from 'react-native';

import { Providers } from './testUtils';

import Entry from './Entry';

describe('The Auth Entry component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom alternateLoginText', () => {
    const tree = renderer.create(
      <Providers>
        <Entry
          setFieldValue={() => {}}
          onPressAlternateLogin={() => {}}
          alternateLoginText={
            'Custom Text to direct people to an alternate login flow'
          }
          alternateLogin
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom authTitleText', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} authTitleText={'Custom Title'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as disabled', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} onPressNext={jest.fn()} disabled />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render in an error state', () => {
    const tree = renderer.create(
      <Providers>
        <Entry
          setFieldValue={jest.fn()}
          errors={{ phone: 'Boom errors.phone Boom' }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render in a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} onPressNext={jest.fn()} isLoading />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with an alternate login option with default text', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} onPressAlternateLogin={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render in a next button', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} onPressNext={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom policyInfo text', () => {
    const tree = renderer.create(
      <Providers>
        <Entry
          setFieldValue={jest.fn()}
          policyInfo={'Boom custom legalese boom'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom promptText', () => {
    const tree = renderer.create(
      <Providers>
        <Entry
          setFieldValue={jest.fn()}
          promptText={'Boom custom prompty text boom'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a value', () => {
    const tree = renderer.create(
      <Providers>
        <Entry
          setFieldValue={jest.fn()}
          values={{ phone: 'Boom values.phone boom' }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom tabTitle', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} tabTitle={'Custom Tab Title'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a inputType phone', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} inputType={'phone'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a inputLabel Phone Number', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} inputLabel={'Phone Number'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a inputAutoComplete as tel', () => {
    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} inputLabel={'Phone Number'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with keyboard vertical offset for Android', () => {
    Platform.OS = 'android';

    const tree = renderer.create(
      <Providers>
        <Entry setFieldValue={jest.fn()} inputLabel={'Phone Number'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
