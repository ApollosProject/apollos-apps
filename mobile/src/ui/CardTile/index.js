import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { compose, pure, defaultProps } from 'recompose';
import { startCase, toLower } from 'lodash';

import Placeholder from 'ui/Placeholder';
import { withIsLoading } from 'ui/isLoading';
import { withTheme, withThemeMixin } from 'ui/theme';
import styled from 'ui/styled';
import { H4, H6, H7 } from 'ui/typography';
import { CardContent, CardActions } from 'ui/Card';
import ChannelLabel from 'ui/ChannelLabel';
import relativeTime from 'utils/relativeTime';

const enhance = compose(
  defaultProps({
    showDetails: false,
  }),
  withIsLoading,
  withThemeMixin(({ theme }) => ({
    type: 'light',
    colors: {
      background: {
        inactive: theme.colors.lightSecondary,
      },
    },
  })),
  withTheme(),
  pure
);

const TileSpacer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit / 2,
}))(View);

const Tile = styled(({ theme }) => ({
  height: '100%',
  aspectRatio: 1,
  borderRadius: theme.sizing.borderRadius,
  backgroundColor: theme.colors.lightTertiary,
  ...Platform.select({
    web: {
      position: 'relative',
      width: '25vw',
      minWidth: '250px',
      maxWidth: '320px',
      height: '0',
      paddingTop: '100%',
    },
  }),
}))(View);

const OverflowFix = styled(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  borderRadius: theme.sizing.borderRadius,
  overflow: 'hidden',
}))(View);

const WebAspectRatioFix = styled({
  justifyContent: 'center',
  ...StyleSheet.absoluteFillObject,
})(View);

const TileNumber = styled(({ theme, size }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: theme.helpers.rem(1 * (size < 2 ? 2 : size)),
  height: theme.helpers.rem(1 * (size < 2 ? 2 : size)),
  justifyContent: 'center',
  alignItems: 'center',
  borderTopLeftRadius: theme.sizing.borderRadius,
  borderBottomRightRadius: theme.sizing.borderRadius,
  backgroundColor: theme.colors.white,
}))(View);

export const CardTile = enhance(
  ({
    number,
    title,
    showDetails,
    byLine,
    date,
    style: styleProp = {},
    isLoading,
    theme,
    children,
    ...otherProps
  }) => (
    <TileSpacer collapsable={false}>
      <Tile style={styleProp} {...otherProps}>
        <OverflowFix>
          <WebAspectRatioFix>
            {typeof number === 'undefined' ? null : (
              <TileNumber size={number.toString().length}>
                <Placeholder.Media
                  size={theme.helpers.rem(
                    1.25 *
                      (number.toString().length < 2
                        ? 2
                        : number.toString().length)
                  )}
                  onReady={!isLoading}
                >
                  <View>
                    <H6>{number}</H6>
                  </View>
                </Placeholder.Media>
              </TileNumber>
            )}

            {typeof title === 'undefined' ? null : (
              <CardContent>
                <H4>{startCase(toLower(title))}</H4>
              </CardContent>
            )}

            {showDetails ? (
              <CardActions>
                <ChannelLabel
                  label={startCase(toLower(byLine))}
                  icon={'video'}
                  isLoading={isLoading}
                  withFlex
                />
                {typeof date === 'undefined' ? null : (
                  <H7>{relativeTime(date)}</H7>
                )}
              </CardActions>
            ) : null}

            {children}
          </WebAspectRatioFix>
        </OverflowFix>
      </Tile>
    </TileSpacer>
  )
);

CardTile.propTypes = {
  title: PropTypes.string,
  number: PropTypes.number,
  showDetails: PropTypes.bool,
  byLine: PropTypes.string,
  date: PropTypes.string,
  style: PropTypes.any, // eslint-disable-line
  isLoading: PropTypes.bool,
};

export default CardTile;
