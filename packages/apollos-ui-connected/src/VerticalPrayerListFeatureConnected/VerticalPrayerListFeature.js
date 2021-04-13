import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  H4,
  Paragraph,
  BodyText,
  Button,
  // ButtonLink,
  // Icon,
  Avatar,
  PaddedView,
  styled,
  H6,
  H3,
} from '@apollosproject/ui-kit';
import { PrayerScreen } from '@apollosproject/ui-prayer';

import EmptyList from './EmptyList';

const StyledAvatarView = styled({
  alignItems: 'center',
})(PaddedView);

const StyledButton = styled({
  width: '100%',
  // flex: 6,
  // marginRight: theme.sizing.baseUnit,
})(Button);

// const StyledButtonLink = styled({
// flex: 1,
// })(ButtonLink);

const VerticalPrayerListFeature = ({ title, subtitle, prayers }) => {
  const [modalOpened, setModalOpened] = useState(false);
  return (
    <>
      <PaddedView>
        <H6>{title}</H6>
        <H3>{subtitle}</H3>
      </PaddedView>
      {prayers.length ? (
        prayers.map((prayer) => (
          <View key={prayer.id}>
            <Card>
              <CardContent>
                <StyledAvatarView>
                  <Avatar size="medium" profile={prayer.requestor} />
                </StyledAvatarView>
                <H4>{`Pray for ${prayer.requestor?.firstName}`}</H4>
                <Paragraph>
                  <BodyText>{prayer.text}</BodyText>
                </Paragraph>
              </CardContent>
              {/*
            <CardActions>
            */}
              <PaddedView>
                <StyledButton
                  title="Start Praying"
                  pill={false}
                  onPress={() => setModalOpened(true)}
                />
              </PaddedView>
              {/*
          <StyledButtonLink onPress={onPressDetails}>
            <Icon name="dots-three-vertical" />
          </StyledButtonLink>
            </CardActions>
          */}
            </Card>
            <Modal
              animationType={'slide'}
              onRequestClose={() => setModalOpened(false)}
              visible={modalOpened}
            >
              <PrayerScreen
                prayer={prayer}
                onPressPrimary={() => setModalOpened(false)}
              />
            </Modal>
          </View>
        ))
      ) : (
        <EmptyList />
      )}
    </>
  );
};

VerticalPrayerListFeature.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  prayers: PropTypes.arrayOf(PropTypes.shape({})),
};

export default VerticalPrayerListFeature;
