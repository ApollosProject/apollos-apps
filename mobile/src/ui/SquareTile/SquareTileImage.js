import ConnectedImage from 'ui/ConnectedImage';
import styled from 'ui/styled';

const SquareTileImage = styled({
  aspectRatio: 1,
  width: '100%',
})(ConnectedImage);

SquareTileImage.propTypes = ConnectedImage.propTypes;
export default SquareTileImage;
