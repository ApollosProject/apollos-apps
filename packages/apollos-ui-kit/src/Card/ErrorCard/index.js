import React from 'react';
import PropTypes from 'prop-types';

import styled from '../../styled';
import { H4, H6 } from '../../typography';
import Card from '../CardWrapper';
import CardContent from '../Content';

const Header = styled({ textAlign: 'center' }, 'ui-kit.Card.ErrorCard.Header')(
  H4
);
const ErrorText = styled(
  { textAlign: 'center' },
  'ui-kit.Card.ErrorCard.ErrorText'
)(H6);

const Err = ({ message = 'Uh oh!', error }) => {
  let errorMessage;
  if (typeof error !== 'string') {
    if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else {
      errorMessage = 'An unexpected error occured';
    }
  } else {
    errorMessage = error;
  }

  return (
    <Card>
      <CardContent>
        <Header>{message}</Header>
        <ErrorText>{errorMessage}</ErrorText>
      </CardContent>
    </Card>
  );
};

Err.propTypes = {
  message: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Err;
