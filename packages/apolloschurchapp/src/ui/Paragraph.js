import { compose } from 'recompose';
import { View } from 'react-native';

import {
  withPlaceholder,
  Paragraph as ParagraphPlaceholder,
} from 'apolloschurchapp/src/ui/Placeholder';
import styled from 'apolloschurchapp/src/ui/styled';

const Paragraph = compose(
  styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit / 2,
  })),
  withPlaceholder(ParagraphPlaceholder)
)(View);

export default Paragraph;
