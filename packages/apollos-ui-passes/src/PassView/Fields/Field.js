import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import { H6, H5, styled } from '@apollosproject/ui-kit';

export const fieldProps = {
  label: PropTypes.string,
  value: PropTypes.string,
  textAlignment: PropTypes.oneOf(['LEFT', 'RIGHT', 'NATURAL', 'CENTER']),
  LabelComponent: PropTypes.func,
  ValueComponent: PropTypes.func,
  isLoading: PropTypes.bool,
};

const FieldTextAlignment = styled(({ textAlignment = 'LEFT' }) => {
  let textAlign = textAlignment.toLowerCase();
  if (textAlign === 'natural') textAlign = 'left';
  return { textAlign };
}, 'ui-passes.PassView.Fields.Field.FieldTextAlignment')(Text);

const FieldColumn = styled(
  {
    flex: 1,
  },
  'ui-passes.PassView.Fields.Field.FieldColumn'
)(View);

const Field = ({
  label,
  value,
  textAlignment,
  LabelComponent = H6,
  ValueComponent = H5,
  isLoading,
}) => (
  <FieldColumn>
    {isLoading ? (
      <>
        <LabelComponent isLoading />
        <ValueComponent isLoading />
      </>
    ) : (
      <>
        {label ? (
          <FieldTextAlignment textAlignment={textAlignment}>
            <LabelComponent>{label}</LabelComponent>
          </FieldTextAlignment>
        ) : null}
        <FieldTextAlignment textAlignment={textAlignment}>
          <ValueComponent>{value}</ValueComponent>
        </FieldTextAlignment>
      </>
    )}
  </FieldColumn>
);

Field.propTypes = fieldProps;

export default Field;
