import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import { ScriptureList } from 'apolloschurchapp/src/ui/Scripture';

const ContentContainer = styled({ paddingVertical: 0 })(PaddedView);

const ContentTab = ({
  title,
  scripture,
  body,
  isLoading,
  route: { jumpTo },
}) => (
  <ScrollView>
    {!isLoading ? (
      <ContentContainer>
        <H2 padded>{title}</H2>
        {scripture && scripture.length ? (
          <ScriptureList scripture={scripture} jumpTo={jumpTo} />
        ) : null}
        <HTMLView>{body}</HTMLView>
      </ContentContainer>
    ) : null}
  </ScrollView>
);

ContentTab.propTypes = {
  title: PropTypes.string,
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      reference: PropTypes.string,
      html: PropTypes.string,
    })
  ),
  body: PropTypes.string,
  isLoading: PropTypes.bool,
  route: PropTypes.shape({
    jumpTo: PropTypes.func,
  }),
};

export default ContentTab;
