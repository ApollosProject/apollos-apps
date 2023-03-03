import React from 'react';
import renderer from 'react-test-renderer';

import { View } from 'react-native';
import FlexedView from '../FlexedView';
import { H3, H6, BodyText } from '../typography';

import styled from '../styled';

import Providers from '../Providers';
import { withThemeMixin, ThemeProvider, withTheme, named } from '.';

const StyledH3 = styled(({ theme: { colors: { primary } } }) => ({
  color: primary,
}))(H3);
const StyledH6 = styled(({ theme: { colors: { secondary } } }) => ({
  color: secondary,
}))(H6);

const TypeExample = () => (
  <FlexedView>
    <StyledH3>Hi there!</StyledH3>
    <StyledH6>Lorem ipsum dolor sit amet.</StyledH6>
    <BodyText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales
      sit amet ante eu lobortis. In vitae faucibus lectus, at interdum nibh.
      Fusce suscipit tincidunt justo, vitae cursus mi fermentum eget.
    </BodyText>
  </FlexedView>
);

const DarkTypeExample = withThemeMixin({
  type: 'dark',
})(TypeExample);

const TypeExampleWithNullInputs = withThemeMixin({
  type: 'light',
  colors: {
    primary: null,
    secondary: null,
  },
})(TypeExample);

const TypeExampleWithSomeColors = withThemeMixin({
  colors: {
    primary: 'salmon',
    secondary: null,
  },
})(TypeExample);

const TypeExampleWithProps = withThemeMixin(({ color, isLight = true }) => ({
  type: isLight ? 'light' : 'dark',
  colors: {
    primary: color,
  },
}))(TypeExample);

describe('withThemeMixin', () => {
  it('overrides styles without affecting siblings', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <FlexedView>
          <TypeExample />
          <DarkTypeExample />
          <TypeExample />
        </FlexedView>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('works with dynamic props', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <FlexedView>
          <TypeExampleWithProps isLight color="red" />
          <TypeExampleWithProps isLight={false} color="blue" />
        </FlexedView>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('prunes null inputs', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <FlexedView>
          <TypeExampleWithNullInputs />
        </FlexedView>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('reverts to themeInput when mixin has null values', () => {
    const tree = renderer.create(
      <ThemeProvider
        themeInput={{ colors: { primary: 'red', secondary: 'blue' } }}
      >
        <FlexedView>
          <TypeExampleWithSomeColors />
        </FlexedView>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('overrides themeInput with theme prop', () => {
    const tree = renderer.create(
      <ThemeProvider
        themeInput={{ colors: { primary: 'red', secondary: 'blue' } }}
        theme={{ colors: { primary: 'green', secondary: 'yellow' } }}
      >
        <FlexedView>
          <TypeExampleWithSomeColors />
        </FlexedView>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});

// Create flexed view that is theme aware
const FlexedViewWithBackground = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.screen,
}))(FlexedView);

const ThemeExample = () => (
  <FlexedViewWithBackground>
    <H3>YOOO</H3>
  </FlexedViewWithBackground>
);

const LightThemeExample = withThemeMixin({
  type: 'light',
})(ThemeExample);

const DarkThemeExample = withThemeMixin({
  type: 'dark',
})(ThemeExample);

describe('ThemeProvider', () => {
  it('defaults to user settings', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <ThemeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders in light theme', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <LightThemeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders in dark theme', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <DarkThemeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('the styled HOC', () => {
  it('provides a theme', () => {
    const StyledView = withTheme(({ theme }) => ({
      style: {
        backgroundColor: theme.colors.primary,
      },
      clickable: false,
    }))(View);
    const tree = renderer.create(
      <Providers>
        <StyledView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('allows a theme to supply overrides', () => {
    const StyledView = withTheme(
      ({ theme }) => ({
        style: {
          backgroundColor: theme.colors.primary,
        },
        clickable: false,
      }),
      'StyledView'
    )(View);
    const overrides = {
      StyledView: { style: { backgroundColor: 'green' }, clickable: true },
    };
    const tree = renderer.create(
      <Providers themeInput={{ overrides }}>
        <StyledView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('allows a theme to supply override functions', () => {
    const StyledView = withTheme(
      ({ theme }) => ({
        style: {
          backgroundColor: theme.colors.primary,
        },
        clickable: false,
      }),
      'StyledView'
    )(View);
    const overrides = {
      StyledView: () => ({ active }) => ({
        style: { backgroundColor: active ? 'active-color' : 'in-active-color' },
        clickable: active,
      }),
    };
    const tree = renderer.create(
      <Providers themeInput={{ overrides }}>
        <StyledView active />
        <StyledView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('merges nested styles from withTheme and an overide', () => {
    const StyledView = withTheme(
      ({ theme }) => ({
        style: {
          backgroundColor: theme.colors.primary,
          color: 'blue',
        },
        clickable: false,
      }),
      'StyledView'
    )(View);
    const overrides = {
      StyledView: {
        style: {
          backgroundColor: 'active-color',
          borderRadius: 7,
        },
        clickable: false,
      },
    };
    const tree = renderer.create(
      <Providers themeInput={{ overrides }}>
        <StyledView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('uses overide when using `named` hoc', () => {
    const StyledView = named('StyledView')(View);
    const overrides = {
      StyledView: {
        style: {
          backgroundColor: 'active-color',
          borderRadius: 7,
        },
        clickable: false,
      },
    };
    const tree = renderer.create(
      <Providers themeInput={{ overrides }}>
        <StyledView />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
