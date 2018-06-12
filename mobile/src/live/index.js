import React from 'react';
import View, { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { UIText } from 'ui/typography';
import styled from 'ui/styled';

const Container = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: theme.sizing.baseUnit / 2,
}))(View);

const Button = styled(({ theme }) => ({
  backgroundColor: theme.colors.primary,
}))(TouchableOpacity);

const LiveNowButton = (props) => (
  <Container>
    <Button onPress={() => props.navigation.navigate('LiveNowModal')}>
      <UIText> Live Now! </UIText>
    </Button>
  </Container>
);

LiveNowButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default LiveNowButton;
