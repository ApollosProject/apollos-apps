import React from 'react';
import PropTypes from 'prop-types';
import Config from 'react-native-config';

import styled from '../../styled';
import { H4, H6 } from '../../typography';
import Card from '../CardWrapper';
import CardContent from '../Content';

const Header = styled({ textAlign: 'center' }, 'Error.Header')(H4);
const ErrorText = styled({ textAlign: 'center' }, 'Error.Text')(H6);

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

  return Config.SHOW_ERRORS === 'true' ? (
    <Card>
      <CardContent>
        <Header>{message}</Header>
        <ErrorText>{errorMessage}</ErrorText>
      </CardContent>
    </Card>
  ) : null;
};

Err.propTypes = {
  message: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Err;
