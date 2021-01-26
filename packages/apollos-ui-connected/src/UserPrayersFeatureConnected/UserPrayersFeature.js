import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  H4,
  Paragraph,
  BodyText,
  CardActions,
  Button,
  ButtonLink,
  Icon,
  Avatar,
  PaddedView,
  styled,
} from '@apollosproject/ui-kit';

const StyledAvatarView = styled({
  alignItems: 'center',
})(PaddedView);

const StyledButton = styled(({ theme }) => ({
  flex: 6,
  marginRight: theme.sizing.baseUnit,
}))(Button);

const StyledButtonLink = styled({
  flex: 1,
})(ButtonLink);

const UserPrayersFeature = ({ title, subtitle, avatar }) => (
  <Card>
    <CardContent>
      <StyledAvatarView>
        <Avatar size="medium" source={avatar} />
      </StyledAvatarView>
      <H4>{title}</H4>
      <Paragraph>
        <BodyText>{subtitle}</BodyText>
      </Paragraph>
    </CardContent>
    <CardActions>
      <StyledButton title="Start Praying" pill={false} />
      <StyledButtonLink>
        <Icon name="dots-three-vertical" />
      </StyledButtonLink>
    </CardActions>
  </Card>
);

UserPrayersFeature.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  avatar: PropTypes.shape({ uri: PropTypes.string }),
};

export default UserPrayersFeature;
