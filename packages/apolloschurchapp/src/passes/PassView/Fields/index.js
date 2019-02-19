import React from 'react';

import { PaddedView, styled } from '@apollosproject/ui-kit';

import Field, { fieldProps } from './Field';

export const FieldSet = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})(PaddedView);

const Fields = ({ fields, ...other }) =>
  fields.map((field) => <Field {...field} key={field.key} {...other} />);

export { fieldProps };
export default Fields;
