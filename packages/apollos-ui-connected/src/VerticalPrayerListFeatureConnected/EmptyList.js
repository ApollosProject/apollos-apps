import React from 'react';
import {
  named,
  styled,
  PaddedView,
  H3,
  BodyText,
  BodySmall,
  // Button,
} from '@apollosproject/ui-kit';

const Container = styled({
  alignItems: 'stretch',
})(PaddedView);

const Header = styled(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H3);

const Title = styled(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(BodyText);

const Subtitle = styled(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.secondary,
  fontStyle: 'italic',
  marginBottom: theme.sizing.baseUnit * 2,
}))(BodySmall);

const EmptyList = ({
  header = '🙏',
  title = "It looks like you don't have any prayers yet",
  subtitle = "Let's fix that! Are you ready to get started?",
  // onPress = () => null,
}) => (
  <Container>
    <Header>{header}</Header>
    <Title>{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
    {/* TODO wire up button once destination is finalized */}
    {/* <Button onPress={onPress} title={'Start Praying'} bordered pill={false} /> */}
  </Container>
);

export default named('VerticalPrayerListConnected.EmptyList')(EmptyList);
