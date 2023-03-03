import renderer from 'react-test-renderer';

import AskName from './AskName';

describe('The Onboarding AskName component', () => {
  it('should render', () => {
    const tree = renderer.create(<AskName setFieldValue={jest.fn()} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <AskName slideTitle={'Custom title text'} setFieldValue={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <AskName
        description={'Custom description text'}
        setFieldValue={jest.fn()}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept a firstName', () => {
    const tree = renderer.create(
      <AskName values={{ firstName: 'Marty' }} setFieldValue={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept a lastName', () => {
    const tree = renderer.create(
      <AskName values={{ lastName: 'McFly' }} setFieldValue={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <AskName setFieldValue={jest.fn()} isLoading />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <AskName onPressPrimary={jest.fn()} setFieldValue={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
});
