import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Linking, View } from 'react-native';
import { Parser, DomHandler } from 'htmlparser2';

import { Paragraph } from '@apollosproject/ui-kit';

import defaultRenderer, { wrapTextChildren } from './defaultRenderer';

export { defaultRenderer, wrapTextChildren };

class HTMLView extends PureComponent {
  static propTypes = {
    children: PropTypes.string,
    isLoading: PropTypes.bool,
    onPressAnchor: PropTypes.func,
    renderer: PropTypes.func,
  };

  static defaultProps = {
    onPressAnchor: (url) => Linking.openURL(url),
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
    this.parser.reset();
  }

  renderDom(dom) {
    return dom
      .map((node, index) => {
        let children = [];
        if (node.children) children = this.renderDom(node.children);

        let renderedNode = this.props.renderer(
          node,
          { children },
          this.props.onPressAnchor
        );
        if (
          !renderedNode &&
          renderedNode !== null &&
          this.props.renderer !== defaultRenderer
        ) {
          renderedNode = defaultRenderer(
            node,
            { children },
            this.props.onPressAnchor
          );
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
      <Paragraph
        lineNumber={8}
        isLoading={this.props.isLoading && !this.state.parsed}
      >
        <View>{this.state.parsed}</View>
      </Paragraph>
    );
  }
}

export default HTMLView;
