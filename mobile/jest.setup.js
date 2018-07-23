import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

jest.mock('client');
jest.mock('react-native-custom-tabs', () => ({
  CustomTabs: {
    openURL: jest.fn(),
  },
}));

jest.mock('react-native-safari-view', () => ({
  isAvailable: jest.fn().mockImplementation(() => Promise.resolve(true)),
  show: jest.fn(),
}));
