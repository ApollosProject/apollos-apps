import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Parser, DomHandler } from 'htmlparser2';

import {
  withPlaceholder,
  Paragraph as ParagraphPlaceholder,
} from 'ui/Placeholder';

import defaultRenderer from './defaultRenderer';

@withPlaceholder(ParagraphPlaceholder, { lineNumber: 8 })
class HTMLView extends PureComponent {
  static propTypes = {
    children: PropTypes.string,
    renderer: PropTypes.func,
  };

  static defaultProps = {
    renderer: defaultRenderer,
  };

  constructor(...args) {
    super(...args);
    this.parser = new Parser(
      new DomHandler(
        (err, dom) => {
          this.parsed = this.renderDom(dom);
        },
        { normalizeWhitespace: true }
      )
    );
    if (this.props.children) this.parse(this.props.children);
  }

  componentWillUpdate(props) {
    this.parse(props.children);
  }

  parse(html = '') {
    this.parser.write(html);
    this.parser.done();
  }

  renderDom(dom) {
    return dom
      .map((node, index) => {
        let children = [];
        if (node.children) children = this.renderDom(node.children);

        let renderedNode = this.props.renderer(node, { children });
        if (
          !renderedNode &&
          renderedNode !== null &&
          this.props.renderer !== defaultRenderer
        ) {
          renderedNode = defaultRenderer(node, { children });
        }

        if (renderedNode && !Array.isArray(renderedNode)) {
          renderedNode = cloneElement(renderedNode, { key: index });
        }
        return renderedNode;
      })
      .filter((e) => e !== undefined);
  }

  render() {
    return <View>{this.parsed}</View>;
  }
}

export default HTMLView;
