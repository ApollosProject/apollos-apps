import PropTypes from 'prop-types';
import styled from 'apolloschurchapp/src/ui/styled';
import { CardActions } from 'apolloschurchapp/src/ui/Card';

const CardFooter = styled(
  ({ floating }) =>
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
