import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Avatar from '../Avatar';
import { withTheme } from '../theme';
import styled from '../styled';
import { H4, UIText } from '../typography';

const Container = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-kit.Comment.HeaderContainer'
)(View);

const CommentAvatar = withTheme(
  ({ theme: { sizing } }) => ({
    themeSize: sizing.baseUnit * 3,
  }),
  'ui-kit.Comment.CommentAvatar'
)(Avatar);

const HeaderTextContainer = styled(
  ({ theme: { sizing } }) => ({
    marginLeft: sizing.baseUnit / 2,
    justifyContent: 'center',
  }),
  'ui-kit.Comment.HeaderTextContainer'
)(View);

const Subtitle = styled(
  ({
    theme: {
      colors: {
        text: { tertiary },
      },
    },
  }) => ({
    color: tertiary,
  }),
  'ui-kit.Comment.Subtitle'
)(UIText);

const ByLine = ({ profile, subtitle, avatarProps = {}, children }) => (
  <Container>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <CommentAvatar profile={profile} {...avatarProps} />
    <HeaderTextContainer>
      {children || (
        <H4>
          {profile.nickName || profile.firstName} {profile.lastName}
        </H4>
      )}
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </HeaderTextContainer>
  </Container>
);

ByLine.propTypes = {
  profile: PropTypes.shape({
    photo: PropTypes.shape({ uri: PropTypes.string }),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    nickName: PropTypes.string,
  }),
  subtitle: PropTypes.string,
  avatarProps: PropTypes.shape({}),
  children: PropTypes.node,
};

export default ByLine;
