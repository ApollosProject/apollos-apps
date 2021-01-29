import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { get } from 'lodash';
import { compose, setDisplayName } from 'recompose';

import ConnectedImage from '../ConnectedImage';
import styled from '../styled';
import { withTheme } from '../theme';
import ActivityIndicator from '../ActivityIndicator';
import { ButtonIcon } from '../Button';
import Icon from '../Icon';
import TouchableScale from '../TouchableScale';

const Container = styled(
  ({ themeSize }) => ({
    width: themeSize,
    height: themeSize,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  'ui-kit.Avatar.Avatar.Container'
)(View);

const PlaceholderIcon = compose(
  setDisplayName('ui-kit.Avatar.Avatar.PlaceholderIcon'),
  withTheme(
    ({ theme: { colors } = {}, themeSize }) => ({
      fill: colors.background.inactive,
      name: 'avatar',
      size: themeSize * 1.09375, // this is a magic number 🧙‍♂️ of 35/33 and might be related to the default size of an icon being 32 🤷‍♂️
    }),
    'ui-kit.Avatar.Avatar.PlaceholderIcon'
  )
)(Icon);

const Image = styled(
  ({ themeSize }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: themeSize / 2,
  }),
  'ui-kit.Avatar.Avatar.Image'
)(ConnectedImage);

const StyledButtonIcon = styled(
  ({ theme, iconBackground }) => ({
    backgroundColor: iconBackground || theme.colors.background.paper,
    ...Platform.select(theme.shadows.default),
  }),
  'ui-kit.Avatar.Avatar.StyledButtonIcon'
)(ButtonIcon);

const NotificationDot = styled(
  ({ avatarSize, theme }) => ({
    aspectRatio: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: avatarSize / 4,
    marginTop: avatarSize / 32,
    marginRight: avatarSize / 32,
    position: 'absolute',
    right: 0,
    top: 0,
    width: avatarSize / 4,
  }),
  'ui-kit.Avatar.Avatar.NotificationDot'
)(View);

const ButtonIconPositioner = styled(
  {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  'ui-kit.Avatar.Avatar.ButtonIconPositioner'
)(View);

const LoadingSpinnerContainer = styled(
  ({ theme }) => ({
    backgroundColor: 'white',
    // The following three measurements are used to match those of the ButtonIcon container
    width: 43,
    height: 43,
    padding: 9.6,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select(theme.shadows.default),
  }),
  'ui-kit.Avatar.Avatar.LoadingSpinnerContainer'
)(View);

const Avatar = ({
  themeSize,
  containerStyle,
  source,
  isLoading,
  buttonIcon,
  iconFill,
  iconSize,
  onPressIcon,
  notification,
  iconButtonProps,
  ...imageProps
}) => (
  <Container style={containerStyle} themeSize={themeSize}>
    {!isLoading && source && source.uri ? (
      <Image source={source} {...imageProps} themeSize={themeSize} />
    ) : (
      <PlaceholderIcon themeSize={themeSize} isLoading={false} />
    )}
    {!isLoading && notification ? ( // sometimes isLoading can be infered by context. This forces it to hide.
      <NotificationDot avatarSize={themeSize} />
    ) : null}
    {buttonIcon ? (
      <ButtonIconPositioner>
        {isLoading ? (
          <LoadingSpinnerContainer>
            <ActivityIndicator size={themeSize / 5} />
          </LoadingSpinnerContainer>
        ) : (
          <StyledButtonIcon
            onPress={onPressIcon}
            name={buttonIcon}
            size={themeSize / 5}
            fill={iconFill}
            TouchableComponent={TouchableScale}
            {...iconButtonProps}
          />
        )}
      </ButtonIconPositioner>
    ) : null}
  </Container>
);

Avatar.propTypes = {
  buttonIcon: PropTypes.string,
  containerStyle: PropTypes.any, // eslint-disable-line
  isLoading: PropTypes.bool,
  onPressIcon: PropTypes.func,
  themeSize: PropTypes.number,
  notification: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  ...ConnectedImage.propTypes,
};

export default withTheme(
  ({ theme, size, themeSize }) => ({
    themeSize:
      themeSize || get(theme.sizing.avatar, size, theme.sizing.avatar.small),
    iconFill: theme.colors.action.primary,
  }),
  'ui.kit.Avatar.Avatar'
)(Avatar);
