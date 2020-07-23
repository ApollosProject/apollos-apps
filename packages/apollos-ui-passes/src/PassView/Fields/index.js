import React from 'react';

import { PaddedView, styled } from '@apollosproject/ui-kit';

import Field, { fieldProps } from './Field';

export const FieldSet = styled(
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  'ui.passes.PassView.Fields.FieldSet'
)(PaddedView);

const Fields = ({ fields, isLoading, ...other }) => {
  let fieldsToRender = fields;
  if (isLoading)
    fieldsToRender = [
      {
        key: 'loading',
        isLoading: true,
        value: '',
        label: '',
      },
    ];
  return fieldsToRender.map((field) => (
    <Field {...field} key={field.key} {...other} />
  ));
};

export { fieldProps };
export default Fields;
