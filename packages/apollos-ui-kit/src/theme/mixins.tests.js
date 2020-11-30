/* eslint-disable */
import React from 'react';
import renderer from 'react-test-renderer';

import FlexedView from '../FlexedView';
import { H3, H6, BodyText } from '../typography';

import { ThemeProvider } from './';
import { withThemeMixin } from './mixins';
import styled from '../styled';

const StyledH3 = styled(({ theme: { colors: { primary }}}) => ({ color: primary }))(H3);
const StyledH6 = styled(({ theme: { colors: { secondary }}}) => ({ color: secondary }))(H6);

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
      <ThemeProvider themeInput={{ colors: { primary: 'red', secondary: 'blue' }}}>
        <FlexedView>
          <TypeExampleWithSomeColors />
        </FlexedView>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
