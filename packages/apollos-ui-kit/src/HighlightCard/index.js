import React from 'react';
import { StyleSheet } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardContent } from '../Card';
import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import FlexedView from '../FlexedView';
import { H3, BodyText } from '../typography';
import { ButtonIcon } from '../Button';

const Overlay = styled(StyleSheet.absoluteFillObject)(LinearGradient);

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.primary,
  maxAspectRatio: 1.2,
  minAspectRatio: 0.75,
  maintainAspectRatio: true,
}))(ConnectedImage);

const Content = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  flexDirection: 'row',
  alignItems: 'flex-end',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2,
}))(CardContent);

const Description = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(BodyText);

const ActionButton = withTheme(({ theme }) => ({
  fill: theme.colors.text.primary,
  iconPadding: theme.sizing.baseUnit * 0.75,
  size: theme.sizing.baseUnit * 1.5,
  style: {
    marginLeft: theme.sizing.baseUnit,
    backgroundColor: Color(theme.colors.text.primary).alpha(0.1),
  },
}))(ButtonIcon);

const CardOverlay = withTheme(
  ({
    theme: {
      type,
      colors: { white, black },
      alpha: { low, medium },
    },
  }) => ({
    colors: [
      Color(type === 'light' ? white : black).fade(medium),
      Color(type === 'light' ? white : black).fade(low),
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  })
)(Overlay);

const HighlightCard = ({
  image,
  title,
  actionIcon,
  description,
  onPressAction,
  theme,
}) => (
  <ThemeMixin
    mixin={{
      type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
      colors: get(theme, 'colors', {}),
    }}
  >
    <Card>
      <Image source={image} />
      <CardOverlay />
      <Content>
        <FlexedView>
          <H3 numberOfLines={description ? 3 : 4}>{title}</H3>
          {description ? (
            <Description numberOfLines={2}>{description}</Description>
          ) : null}
        </FlexedView>
        {onPressAction ? (
          <ActionButton name={actionIcon} onPress={onPressAction} />
        ) : null}
      </Content>
    </Card>
  </ThemeMixin>
);

HighlightCard.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  actionIcon: PropTypes.string,
  description: PropTypes.string,
  onPressAction: PropTypes.func,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

HighlightCard.defaultProps = {
  actionIcon: 'play-solid',
};

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
