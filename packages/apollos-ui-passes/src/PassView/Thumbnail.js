import { styled, ConnectedImage } from '@apollosproject/ui-kit';

const Thumbnail = styled(({ theme }) => ({
  height: '100%',
  minHeight: theme.sizing.baseUnit * 4,
  resizeMode: 'contain',
  flex: 0.25,
  backgroundColor: theme.colors.transparent,
}))(ConnectedImage);

export default Thumbnail;
