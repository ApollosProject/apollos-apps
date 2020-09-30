import React from 'react';
import { compose, setDisplayName, pure } from 'recompose';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../../styled';
import BodyText from '../BodyText';

const enhance = compose(
  setDisplayName('BulletListItem'),
  pure
);

const Wrapper = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    paddingBottom: theme.helpers.verticalRhythm(0.375),
  }),
  'ui-kit.Typography.OrderedListItem.Wrapper'
)(View);

const Bullet = styled(
  ({ theme }) => ({
    // Set in a typographic unit to reflect changes in the default type size.
    paddingRight: theme.helpers.rem(1) / 2,
  }),
  'ui-kit.Typography.OrderedListItem.Bullet'
)(View);

const IosTextWrapFix = styled(
  {
    // 😢
    flexShrink: 1,
  },
  'ui-kit.Typography.OrderedListItem.IosTextWrapFix'
)(View);

const OrderedListItem = enhance(({ children, index }) => (
  <Wrapper>
    <Bullet>
      <BodyText>{`${index}.`}</BodyText>
    </Bullet>
    <IosTextWrapFix>
      {typeof children === 'string' ? (
        <BodyText>{children}</BodyText>
      ) : (
        children
      )}
    </IosTextWrapFix>
  </Wrapper>
));

OrderedListItem.propTypes = {
  children: PropTypes.oneOfType([
    /*
     * There is no way to type check against known text nodes but expect problems if you try to
     * pass something other than a string or text elements (this includes children of children).
     */
    PropTypes.string,
    PropTypes.node,
  ]),
};

export default OrderedListItem;
