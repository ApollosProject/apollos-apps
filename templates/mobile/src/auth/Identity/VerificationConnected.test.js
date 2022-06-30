import renderer from 'react-test-renderer';
import { LoginContext } from '../LoginProvider';
import { AuthContext } from '../Provider';
import VerificationConnected from './VerificationConnected';

describe('ui-authentication VerificationConnected', () => {
  it('should render', () => {
    const tree = renderer.create(
      <AuthContext.Provider value={{ login: jest.fn() }}>
        <LoginContext.Provider value={{ authType: 'phone' }}>
          <VerificationConnected confirmationTitleText="Test" />
        </LoginContext.Provider>
      </AuthContext.Provider>
    );
    expect(tree).toMatchSnapshot();
  });
});
