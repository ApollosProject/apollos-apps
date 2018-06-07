import React from 'react';
import { compose, pure } from 'recompose';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import styled from 'ui/styled';
import { withThemeMixin } from 'ui/theme';
import { BodyText } from 'ui/typography';

const Block = compose(
  styled(({ theme }) => ({
    alignSelf: 'stretch',
    marginVertical: theme.sizing.baseUnit * 2,
    paddingVertical: theme.sizing.baseUnit * 1.5,
    paddingHorizontal: theme.sizing.baseUnit,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.text.tertiary,
  })),
  // Forced <BodyText> to inherit QuoteText styles.
  // This is necessary for HTMLView to properly style <blockquote>'s 😥
  withThemeMixin(({ theme }) => ({
    overrides: {
      BodyText: {
        fontFamily: theme.typography.serif.regular.italic,
        textAlign: 'center',
        color: theme.colors.text.primary,
      },
    },
  }))
)(View);

const BlockQuote = pure(({ children }) => (
  <Block>
    {typeof children === 'string' ? <BodyText>{children}</BodyText> : children}
  </Block>
));

BlockQuote.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
};

export default BlockQuote;