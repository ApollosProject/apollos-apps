import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Placeholder from 'rn-placeholder';

import { H4, H6 } from 'apolloschurchapp/src/ui/typography';

import ScriptureHTMLView from './ScriptureHTMLView';
import getScripture from './getScripture';

const Item = ({ query }) => (
  <Query query={getScripture} variables={{ query }}>
    {({ loading, data }) =>
      console.log('data = ', data) || (
        <View>
          <H4>
            {' '}
            {/* wrapping text element provides unified baseline */}
            <H4>{get(data, 'scripture.query', '')}</H4> <H6>ESV</H6>
          </H4>
          <Placeholder.Paragraph
            lineNumber={5}
            onReady={!loading}
            lastLineWidth="60%"
            firstLineWidth="40%"
          >
            <ScriptureHTMLView>
              {get(data, 'scripture.html', '')}
            </ScriptureHTMLView>
          </Placeholder.Paragraph>
        </View>
      )
    }
  </Query>
);

Item.propTypes = {
  query: PropTypes.string,
};

export default Item;
