import renderer from 'react-test-renderer';

import Verification from './Verification';

describe('The Auth Verification component', () => {
  it('should render', () => {
    const tree = renderer.create(<Verification setFieldValue={() => null} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom confirmationTitleText', () => {
    const tree = renderer.create(
      <Verification
        setFieldValue={jest.fn()}
        confirmationTitleText={'Custom Title'}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom confirmationPromptText', () => {
    const tree = renderer.create(
      <Verification
        setFieldValue={jest.fn()}
        confirmationPromptText={'Boom custom prompty text boom'}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as disabled', () => {
    const tree = renderer.create(
      <Verification
        setFieldValue={jest.fn()}
        onPressNext={jest.fn()}
        disabled
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render in an error state', () => {
    const tree = renderer.create(
      <Verification
        setFieldValue={jest.fn()}
        errors={{ code: 'Boom errors.code Boom' }}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render in a loading state', () => {
    const tree = renderer.create(
      <Verification
        setFieldValue={jest.fn()}
        onPressNext={jest.fn()}
        isLoading
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render in a next button', () => {
    const tree = renderer.create(
      <Verification setFieldValue={jest.fn()} onPressNext={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a value', () => {
    const tree = renderer.create(
      <Verification
        setFieldValue={jest.fn()}
        values={{ code: 'Boom values.code boom' }}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
