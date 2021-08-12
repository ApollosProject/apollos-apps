import React from 'react';

import {
  styled,
  withTheme,
  CenteredView,
  PaddedView,
  Icon,
  H4,
  BodySmall,
} from '@apollosproject/ui-kit';

const StyledIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.text.tertiary,
    style: {
      marginRight: theme.sizing.baseUnit / 2,
    },
  }),
  'ui-connected.SearchFeedConnected.EmptySearch.Icon'
)(Icon);

const Title = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-connected.SearchFeedConnected.EmptySearch.Title'
)(PaddedView);

const EmptySearchText = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  }),
  'ui-connected.SearchFeedConnected.EmptySearch.Text'
);

const StyledH4 = EmptySearchText(H4);
const StyledBodySmall = EmptySearchText(BodySmall);

const EmptySearch = () => (
  <CenteredView>
    <Title vertical={false}>
      <StyledIcon name={'search'} />
      <StyledH4 padded>Let&apos;s find some content!</StyledH4>
    </Title>
    <PaddedView vertical={false}>
      <StyledBodySmall>
        {'Type your search in the input above.'}
      </StyledBodySmall>
    </PaddedView>
  </CenteredView>
);

export default EmptySearch;
