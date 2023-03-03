import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import { ThemeMixin } from '../theme';
import Card from '../Card';
import styled from '../styled';

export MediaThumbnailItem from './Item';
export MediaThumbnailIcon from './Icon';

const StyledCard = styled(
  ({ theme }) => ({
    height: theme.sizing.baseUnit * 5,
  }),
  'ui-kit.MediaThumbnail.StyledCard'
)(Card);

const Overlay = styled(
  ({ theme }) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background.screen,
    opacity: theme.alpha.low,
  }),
  'ui-kit.MediaThumbnail.Overlay'
)(View);

const MediaThumbnail = ({
  image,
  children,
  forceRatio = 16 / 9, // default to 16:9 widescreen video ratio
  contentThemeType = 'dark',
  ...cardProps
}) => (
  <StyledCard forceRatio={forceRatio} {...cardProps}>
    <ThemeMixin mixin={{ type: contentThemeType }}>
      <ConnectedImage source={image} style={StyleSheet.absoluteFill} />
      <Overlay />
      {children}
    </ThemeMixin>
  </StyledCard>
);

MediaThumbnail.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  forceRatio: PropTypes.number,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  contentThemeType: PropTypes.string,
};

export default MediaThumbnail;
