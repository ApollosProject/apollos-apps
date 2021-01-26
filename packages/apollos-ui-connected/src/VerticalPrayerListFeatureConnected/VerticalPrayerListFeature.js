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
  H6,
  H3,
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

const VerticalPrayerListFeature = ({
  title,
  subtitle,
  prayers,
  onPressPrimary,
  onPressDetails,
}) => (
  <>
    <PaddedView>
      <H6>{title}</H6>
      <H3>{subtitle}</H3>
    </PaddedView>
    {prayers.map((prayer) => (
      <Card key={prayer.id}>
        <CardContent>
          <StyledAvatarView>
            <Avatar size="medium" source={prayer.requestor?.photo} />
          </StyledAvatarView>
          <H4>{`Pray for ${prayer.requestor?.firstName}`}</H4>
          <Paragraph>
            <BodyText>{prayer.text}</BodyText>
          </Paragraph>
        </CardContent>
        <CardActions>
          <StyledButton
            title="Start Praying"
            pill={false}
            onPress={onPressPrimary}
          />
          <StyledButtonLink onPress={onPressDetails}>
            <Icon name="dots-three-vertical" />
          </StyledButtonLink>
        </CardActions>
      </Card>
    ))}
  </>
);

VerticalPrayerListFeature.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  prayers: PropTypes.arrayOf(PropTypes.shape({})),
  onPressPrimary: PropTypes.func,
  onPressDetails: PropTypes.func,
};

export default VerticalPrayerListFeature;
