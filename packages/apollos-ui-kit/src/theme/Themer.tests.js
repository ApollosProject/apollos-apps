import React from 'react';
import { Text, View } from 'react-native';
import renderer from 'react-test-renderer';
import Themer, { useTheme, Theme, named } from './Themer';

describe('Themer', () => {
  it('should pass theme down through useTheme hook', () => {
    const Paper = () => {
      const theme = useTheme();
      return <Text>{theme.colors.paper}</Text>;
    };
    const App = () => (
      <Themer>
        <Paper />
      </Themer>
    );
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });

  it('has a backwards compatible consumer for class components', () => {
    class Paper extends React.PureComponent {
      render() {
        return <Theme>{(theme) => <Text>{theme.colors.paper}</Text>}</Theme>;
      }
    }
    const App = () => (
      <Themer>
        <Paper />
      </Themer>
    );
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });

  it('should allow for updating the theme provider', () => {
    const Paper = () => {
      const theme = useTheme();
      return <Text>{theme.colors.paper}</Text>;
    };
    const PaperParent = () => {
      const theme = { colors: { paper: 'red' } };
      return (
        <Themer theme={theme}>
          <Paper />
        </Themer>
      );
    };
    const App = () => {
      return (
        <Themer>
          <PaperParent />
        </Themer>
      );
    };
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });

  it('should allow for overrides', () => {
    const NamedPaper = named('Paper')(({ prop }) => <View prop={prop} />);
    const PaperParent = () => {
      const theme = { overrides: { Paper: { prop: 'hello' } } };
      return (
        <Themer theme={theme}>
          <NamedPaper />
        </Themer>
      );
    };
    const App = () => {
      return (
        <Themer>
          <PaperParent />
        </Themer>
      );
    };
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });

  it('should generate entirely new themes based on overrides', () => {
    const outerTheme = {
      type: 'dark',
      colors: { primary: 'red', secondary: 'green', tertiary: 'salmon' },
    };
    const innerTheme = { type: 'light' };

    // We expect the new inner theme to be a light theme, with a red primary.

    const PrintThemeInSnapshot = () => {
      const theme = useTheme();
      return <View theme={theme} />;
    };

    const App = () => (
      <Themer theme={outerTheme}>
        <Themer theme={innerTheme}>
          <PrintThemeInSnapshot />
        </Themer>
      </Themer>
    );

    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });
});
