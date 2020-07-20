import { CastButton } from 'react-native-google-cast';

import { styled } from '@apollosproject/ui-kit';

const StyledCastButton = styled(
  ({ theme }) => ({
    width: 40 + theme.sizing.baseUnit * 1.25,
    height: 40 + theme.sizing.baseUnit * 1.25,
    tintColor: theme.colors.paper,
  }),
  'ui-media.MediaPlayer.GoogleCastButton.StyledCastButton'
)(CastButton);

export default StyledCastButton;
