import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Platform } from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { branch, compose, withProps, withState } from 'recompose';
import isFunction from 'lodash/isFunction';

import { withThemeMixin, withTheme } from 'ui/theme';
import styled from 'ui/styled';

import TabBar from './TabBar';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const withStyles = styled({ flex: 1 }, 'TabView');

const defaultHeaderRenderer = () =>
  compose(
    withThemeMixin(({ theme }) => ({
      colors: {
        text: {
          primary: theme.colors.darkPrimary,
        },
        background: {
          primary: theme.colors.background.primary,
        },
      },
    })),
    withTheme(({ theme, mobile }) => ({
      indicatorColor: mobile ? undefined : theme.colors.primary,
    }))
  )((props) => <TabBar {...props} />);

const TabView = compose(
  withStyles,
  branch(
    ({ index }) => typeof index !== 'number',
    withState('index', 'onIndexChange', ({ initialIndex }) => initialIndex)
  ),
  withProps((props) => {
    function onIndexChange(index) {
      if (isFunction(props.onIndexChange)) props.onIndexChange(index);
      if (isFunction(props.onChange)) props.onChange(index);
    }

    return {
      navigationState: {
        index: props.index,
        routes: props.routes.map((routeProps) => ({
          ...routeProps,
          jumpTo(key) {
            const index = props.routes.findIndex((r) => r.key === key);
            return onIndexChange(index);
          },
        })),
      },
      initialLayout,
      renderHeader: props.renderHeader
        ? props.renderHeader
        : defaultHeaderRenderer(props),
      onIndexChange,
    };
  })
)(TabViewAnimated);

TabView.propTypes = {
  initialIndex: PropTypes.number,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  renderScene: PropTypes.func.isRequired,
  renderHeader: PropTypes.func,
  swipeEnabled: PropTypes.bool,
  autoHeightEnabled: PropTypes.bool,
};

TabView.defaultProps = {
  initialIndex: 0,
  swipeEnabled: Platform.OS !== 'web',
  autoHeightEnabled: false,
};

export { SceneMap, TabBar };
export default TabView;
