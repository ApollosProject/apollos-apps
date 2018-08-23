import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import Spacer from 'apolloschurchapp/src/ui/Spacer';

import Item from './Item';

const copyright =
  '<h6>Scripture taken from The Holy Bible, English Standard Version. Copyright &copy;2001 by <a href="http://www.crosswaybibles.org">Crossway Bibles</a>, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Text provided by the <a href="http://www.gnpcb.org/esv/share/services/">Crossway Bibles Web Service</a><h6>';

const Scripture = ({ references = [] }) => (
  <View>
    {references.map((ref) => <Item query={ref} key={ref} />)}
    <Spacer byHeight />
    <HTMLView>{copyright}</HTMLView>
  </View>
);

Scripture.propTypes = {
  references: PropTypes.shape({
    query: PropTypes.string,
    passages: PropTypes.string,
  }),
};

export default Scripture;
