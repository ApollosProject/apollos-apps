import React from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';

import Providers from '../Providers';

import withTheme, { named } from './withTheme';

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
