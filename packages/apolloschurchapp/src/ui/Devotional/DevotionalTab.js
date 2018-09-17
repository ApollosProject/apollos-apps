import React from 'react';
import { ScrollView } from 'react-native';
import { startCase, toLower } from 'lodash';
import PropTypes from 'prop-types';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import { H2, H4 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import scriptures from 'apolloschurchapp/src/utils/scriptures';

const ContentContainer = styled({ paddingVertical: 0 })(PaddedView);

const titleCase = (text) => startCase(toLower(text));

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
  route: { jumpTo },
}) => (
  <ScrollView>
    {!isLoading ? (
      <ContentContainer>
        <H2 padded>{titleCase(title)}</H2>
        {scripture && scripture.length ? (
          <ScriptureLink padded onPress={() => jumpTo('scripture')}>
            {scriptures.list({ scripture })}
          </ScriptureLink>
        ) : null}
        <HTMLView>{body}</HTMLView>
      </ContentContainer>
    ) : null}
  </ScrollView>
);

DevotionalTab.propTypes = {
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

export default DevotionalTab;
