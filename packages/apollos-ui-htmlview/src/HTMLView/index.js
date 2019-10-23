import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Parser, DomHandler } from 'htmlparser2';

import { Paragraph as ParagraphPlaceholder } from '@apollosproject/ui-kit';

import defaultRenderer, { wrapTextChildren } from './defaultRenderer';

export { defaultRenderer, wrapTextChildren };

class HTMLView extends PureComponent {
  static propTypes = {
    children: PropTypes.string,
    renderer: PropTypes.func,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    renderer: defaultRenderer,
  };

  constructor(...args) {
    super(...args);

    this.parser = new Parser(
      new DomHandler(
        (err, dom) => {
          this.parsed = wrapTextChildren({
            children: this.renderDom(dom),
            strip: false,
          });
        },
        { normalizeWhitespace: true }
      )
    );

    if (this.props.children) {
      this.parse(this.props.children);
    } else {
      this.parsed = null;
    }

    this.state = { parsed: this.parsed };
  }

  componentDidUpdate(lastProps) {
    if (this.props.children !== lastProps.children) {
      this.parse(this.props.children);
      this.setState({ parsed: this.parsed }); // eslint-disable-line react/no-did-update-set-state
    }
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
    return (
      <ParagraphPlaceholder lineNumber={8} onReady={!this.props.isLoading}>
        <View>{this.state.parsed}</View>
      </ParagraphPlaceholder>
    );
  }
}

export default HTMLView;
