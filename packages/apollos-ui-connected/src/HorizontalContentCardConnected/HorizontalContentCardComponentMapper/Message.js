import React from 'react';
import PropTypes from 'prop-types';
import { H3, H6, BodyText, PaddedView } from '@apollosproject/ui-kit';

const Message = ({ title, subtitle, body }) => (
  <PaddedView>
    {title ? <H3>{title}</H3> : null}
    {subtitle ? <H6>{subtitle}</H6> : null}
    {body ? <BodyText>{body}</BodyText> : null}
  </PaddedView>
);
Message.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  body: PropTypes.string,
};

export default Message;
