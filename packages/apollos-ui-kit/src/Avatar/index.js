import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { get } from 'lodash';
import { compose } from 'recompose';

import ConnectedImage from '../ConnectedImage';
import styled from '../styled';
import { withTheme } from '../theme';
import ActivityIndicator from '../ActivityIndicator';
import { ButtonIcon } from '../Button';
import Icon from '../Icon';
import TouchableScale from '../TouchableScale';

export { default as AvatarList } from './List';

const enhance = withTheme(({ theme, size }) => ({
  themeSize: get(theme.sizing.avatar, size, theme.sizing.avatar.small),
}));

const Container = styled(
  ({ themeSize }) => ({
    width: themeSize,
    height: themeSize,
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
  'Avatar'
)(View);

const PlaceholderIcon = compose(
  withTheme(({ theme: { colors } = {} }) => ({
    fill: colors.background.inactive,
  }))
)(Icon);

const Image = styled(({ themeSize }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: themeSize / 2,
}))(ConnectedImage);

const StyledButtonIcon = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
  ...Platform.select(theme.shadows.default),
}))(ButtonIcon);

const ButtonIconPositioner = styled({
  position: 'absolute',
  bottom: 0,
  right: 0,
})(View);

const LoadingSpinnerContainer = styled(({ theme }) => ({
  backgroundColor: 'white',
  // The following three measurements are used to match those of the ButtonIcon container
  width: 43,
  height: 43,
  padding: 9.6,
  borderRadius: 50,
  justifyContent: 'center',
  alignItems: 'center',
  ...Platform.select(theme.shadows.default),
}))(View);

const Avatar = enhance(
  ({
    themeSize,
    containerStyle,
    source,
    isLoading,
    buttonIcon,
    iconFill,
    onPressIcon,
    ...imageProps
  }) => (
    <Container style={containerStyle} themeSize={themeSize}>
      {source && source.uri ? (
        <Image
          source={source}
          {...imageProps}
          themeSize={themeSize}
          isLoading={isLoading}
        />
      ) : (
        <PlaceholderIcon name="avatar" size={themeSize} />
      )}
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
            />
          )}
        </ButtonIconPositioner>
      ) : null}
    </Container>
  )
);

Avatar.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  containerStyle: PropTypes.any, // eslint-disable-line
  buttonIcon: PropTypes.string,
  onPressIcon: PropTypes.func,
  ...ConnectedImage.propTypes,
};

export default withTheme(({ theme, size }) => ({
  themeSize: get(theme.sizing.avatar, size, theme.sizing.avatar.small),
  iconFill: theme.colors.action.primary,
}))(Avatar);
