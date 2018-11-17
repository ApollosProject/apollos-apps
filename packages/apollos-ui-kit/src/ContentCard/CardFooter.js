import PropTypes from 'prop-types';
import styled from '../styled';
import { CardActions } from '../Card';

const CardFooter = styled(({ floating }) =>
  floating
    ? {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }
    : {}
)(CardActions);

CardFooter.propTypes = {
  floating: PropTypes.bool,
};

export default CardFooter;
