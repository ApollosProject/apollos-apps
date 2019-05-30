import React from 'react';
import renderer from 'react-test-renderer';
import { kebabCase } from 'lodash';
import Svg, { Path } from 'react-native-svg';

import Providers from '../Providers';

import * as icons from './icons';
import makeIcon from './icons/makeIcon';

import Icon from '.';

Object.keys(icons).forEach((iconName) => {
  describe(`The ${iconName} icon`, () => {
    it('renders correctly', () => {
      const tree = renderer.create(
        <Providers>
          <Icon name={kebabCase(iconName)} />
        </Providers>
      );
      expect(tree).toMatchSnapshot();
    });
  });
});

describe(`The Icon component`, () => {
  it('accepts an iconInput object (custom icons)', () => {
    // Bible icon by Royyan Wijaya from the Noun Project
    const SalmonBible = makeIcon(
      ({ size = 32, fill = 'salmon', ...otherProps } = {}) => (
        <Svg width={size} height={size} viewBox="0 0 32 40" {...otherProps}>
          <Path
            d="M24.8 32h-18C5.2 32 4 30.8 4 29.3s1.2-2.8 2.8-2.8h18c.4 0 .8.3.8.8v4c-.1.4-.4.7-.8.7zm-18-4c-.7 0-1.3.6-1.3 1.3s.6 1.3 1.3 1.3H24V28H6.8z"
            fill={fill}
          />
          <Path
            d="M27.3 32h-2.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h2.5c.4 0 .8.3.8.8s-.4.8-.8.8zM4.8 30.2l-.5-.2a.5.5 0 0 1-.3-.5v-.2c0-.4.3-.8.8-.8s.8.3.8.8v.1c0 .4-.2.7-.6.8h-.2z"
            fill={fill}
          />
          <Path
            d="M27.3 0H7.9A3.8 3.8 0 0 0 4 3.9v25.4c0 .4.3.7.8.7s.8-.3.8-.8c0-.7.6-1.3 1.3-1.3h20.5c.4 0 .8-.3.8-.8V.8c-.2-.5-.5-.8-.9-.8zM21 10.1h-4.3v12.8c0 .4-.3.8-.8.8s-.8-.3-.8-.8V10.1H11c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h4.3V4.9c0-.4.3-.8.8-.8s.8.3.8.8v3.7H21c.4 0 .8.3.8.8s-.3.7-.8.7z"
            fill={fill}
          />
        </Svg>
      )
    );

    const customIconsObject = {
      Bible: SalmonBible,
    };

    const tree = renderer.create(
      <Providers iconInput={customIconsObject}>
        <Icon name={'bible'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('overrides UIKit icons with iconInput (custom icons) that have the same name', () => {
    const SalmonUmbrella = makeIcon(
      ({ size = 32, fill = 'salmon', ...otherProps } = {}) => (
        <Svg width={size} height={size} viewBox="0 0 32 32" {...otherProps}>
          <Path
            d="M27 14h5c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2v0zM27 14c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2v0 14c0 1.112-0.895 2-2 2-1.112 0-2-0.896-2-2.001v-1.494c0-0.291 0.224-0.505 0.5-0.505 0.268 0 0.5 0.226 0.5 0.505v1.505c0 0.547 0.444 0.991 1 0.991 0.552 0 1-0.451 1-0.991v-14.009c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-1.105-1.119-2-2.5-2s-2.5 0.895-2.5 2c0-5.415 6.671-9.825 15-9.995v-1.506c0-0.283 0.224-0.499 0.5-0.499 0.268 0 0.5 0.224 0.5 0.499v1.506c8.329 0.17 15 4.58 15 9.995h-5z"
            fill={fill}
          />
        </Svg>
      )
    );

    const customIconsObject = {
      Umbrella: SalmonUmbrella,
    };

    const tree = renderer.create(
      <Providers iconInput={customIconsObject}>
        <Icon name={'umbrella'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
