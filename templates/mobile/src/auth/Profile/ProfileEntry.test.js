import renderer from 'react-test-renderer';

import ProfileEntry from './ProfileEntry';

describe('ui-auth/Profile/ProfileEntry', () => {
  it('should render', () => {
    const tree = renderer.create(
      <ProfileEntry setFieldValue={jest.fn()} onPressBack={() => null} />
    );
    expect(tree).toMatchSnapshot();
  });
});
