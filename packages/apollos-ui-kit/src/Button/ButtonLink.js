import { Text } from 'react-native';

import styled from '../styled';

const ButtonLink = styled(
  ({ theme }) => ({
    color: theme.colors.text.link,
  }),
  'ui-kit.ButtonLink.ButtonLink'
)(Text);

export default ButtonLink;
