import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Dimensions } from 'react-native';

import Card from '../Card';
import { ImageSourceType } from '../ConnectedImage';
import { ThemeMixin } from '../theme';
import { withIsLoading } from '../isLoading';
import styled from '../styled';

import ImageHeader from './ImageHeader';
import TextHeader from './TextHeader';
import ContentText from './ContentText';
import Metrics from './Metrics';
import CardFooter from './CardFooter';

const ContentCardWrapper = styled(({ tile }) => {
  const style = {};
  if (tile) style.width = Dimensions.get('window').width * 0.66;
  return style;
})(Card);

class ContentCard extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    summary: PropTypes.string,
    coverImage: PropTypes.oneOfType([
      PropTypes.arrayOf(ImageSourceType),
      ImageSourceType,
    ]),
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    theme: PropTypes.shape({
      type: PropTypes.string,
      colors: PropTypes.shape({}),
    }),
    tile: PropTypes.bool,
    header: PropTypes.element,
    content: PropTypes.element,
    footer: PropTypes.element,
  };

  renderCardHeader() {
    if (this.props.header) return this.props.header;
    if (this.props.coverImage || this.props.isLoading) {
      let forceRatio = null;
      if (this.props.isLoading) {
        forceRatio = 2;
      } else if (this.props.tile) {
        if (this.props.title) {
          forceRatio = 2;
        } else {
          forceRatio = 1;
        }
      }

      return (
        <ImageHeader
          coverImage={this.props.coverImage}
          forceRatio={forceRatio}
          showOverlayColor={!this.props.isLoading && !this.props.title}
        />
      );
    }
    return <TextHeader title={this.props.title} />;
  }

  renderCardContent() {
    if (this.props.content) return this.props.content;
    if (!this.props.title && !this.props.isLoading) return null;
    return (
      <ContentText
        tile={this.props.tile}
        isLoading={this.props.isLoading}
        title={this.props.coverImage ? this.props.title : undefined}
        summary={this.props.summary}
      />
    );
  }

  renderCardFooter() {
    if (this.props.footer) return this.props.footer;
    if (!this.props.metrics && !this.props.isLoading) return null;

    const floating =
      !this.props.isLoading && this.props.coverImage && !this.props.title;

    const footer = (
      <CardFooter floating={this.props.tile || floating}>
        <Metrics
          isLoading={this.props.isLoading}
          metrics={this.props.metrics}
          floating={floating}
        />
      </CardFooter>
    );

    if (floating) {
      return (
        <ThemeMixin
          mixin={{
            type: 'dark',
            colors: get(this.props, 'theme.colors'),
          }}
        >
          {footer}
        </ThemeMixin>
      );
    }
    return footer;
  }

  render() {
    const {
      isLoading,
      title,
      summary,
      coverImage,
      metrics,
      theme,
      tile,
      fixedSize,
      children,
      ...cardProps
    } = this.props;

    return (
      <ThemeMixin
        mixin={{
          type: get(this.props, 'theme.type', 'light').toLowerCase(),
          colors: get(this.props, 'theme.colors', {}),
        }}
      >
        <ContentCardWrapper
          forceRatio={this.props.tile ? 1 : undefined}
          tile={this.props.tile}
          isLoading={this.props.isLoading}
          {...cardProps}
        >
          {this.renderCardHeader()}
          {this.renderCardContent()}
          {this.renderCardFooter()}
        </ContentCardWrapper>
      </ThemeMixin>
    );
  }
}

export default withIsLoading(ContentCard);
