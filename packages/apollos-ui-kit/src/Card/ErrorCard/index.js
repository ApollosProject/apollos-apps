import React from 'react';
import PropTypes from 'prop-types';

import styled from '../../styled';
import { H6, BodyText } from '../../typography';
import ChannelLabel from '../../ChannelLabel';
import Card from '../CardWrapper';
import CardContent from '../Content';

const StyledChannelLabel = styled(
  ({ theme }) => ({
    tintColor: theme.colors.tertiary,
  }),
  'ui-kit.ErrorCard.StyledChannelLabel'
)(ChannelLabel);

const Err = ({ message = 'Uh oh!', error, showErrorMessage }) => {
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
        <StyledChannelLabel label={'Something went wrong'} icon={'warning'} />
        <H6>{showErrorMessage ? errorMessage : null}</H6>
        <BodyText>{message}</BodyText>
      </CardContent>
    </Card>
  );
};

Err.propTypes = {
  message: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showErrorMessage: PropTypes.bool,
};

Err.defaultProps = {
  message:
    "Oh no! We're sorry! We logged your error and notified our team directly. In the mean time, please try again.",
  showErrorMessage: false,
};

export default Err;
