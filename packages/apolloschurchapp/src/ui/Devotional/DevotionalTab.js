import React from 'react';
import { ScrollView } from 'react-native';
import { startCase, toLower } from 'lodash';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2, H4 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import scriptures from 'apolloschurchapp/src/utils/scriptures';

const ContentContainer = styled({ paddingVertical: 0 })(PaddedView)

const titleCase = text => (startCase(toLower(text)));

const ScriptureLink = styled(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  textDecorationLine: 'underline',
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H4);

const DevotionalTab = ({
  title,
  scripture,
  body,
  isLoading,
  route: {
    jumpTo
  },
}) => (
  <ScrollView>
    <ContentContainer>
      <H2 padded>{titleCase(title)}</H2>
      {(scripture && scripture) ? (
        <ScriptureLink padded onPress={() => jumpTo('scripture')}>
          {scriptures.list({ scripture })}
        </ScriptureLink>
      ) : null}
      <HTMLView>{body}</HTMLView>
    </ContentContainer>
  </ScrollView>
)

export default DevotionalTab;
