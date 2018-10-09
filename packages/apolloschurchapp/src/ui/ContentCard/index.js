import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import Card from 'apolloschurchapp/src/ui/Card';
import { ImageSourceType } from 'apolloschurchapp/src/ui/ConnectedImage';
import { ThemeMixin } from 'apolloschurchapp/src/ui/theme';
import { withIsLoading } from 'apolloschurchapp/src/ui/isLoading';

import ImageHeader from './ImageHeader';
import TextHeader from './TextHeader';
import ContentText from './ContentText';
import Metrics from './Metrics';
import CardFooter from './CardFooter';

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
    theme: PropTypes.shape({}),
  };

  renderCardHeader() {
    if (this.props.coverImage || this.props.isLoading) {
      return (
        <ImageHeader
          coverImage={this.props.coverImage}
          forceRatio={!this.props.isLoading && !this.props.title}
          showOverlayColor={!this.props.isLoading && !this.props.title}
        />
      );
    }
    return <TextHeader title={this.props.title} />;
  }

  renderCardContent() {
    if (!this.props.title && !this.props.isLoading) return null;
    return (
      <ContentText
        isLoading={this.props.isLoading}
        title={this.props.coverImage ? this.props.title : undefined}
        summary={this.props.summary}
      />
    );
  }

  renderCardFooter() {
    if (!this.props.metrics && !this.props.isLoading) return null;
    const floating =
      !this.props.isLoading && this.props.coverImage && !this.props.title;

    const footer = (
      <CardFooter floating={floating}>
        <Metrics
          isLoading={this.props.isLoading}
          metrics={this.props.metrics}
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
    return (
      <ThemeMixin
        mixin={{
          type: get(this.props, 'theme.type', 'light').toLowerCase(),
          colors: get(this.props, 'theme.colors'),
        }}
      >
        <Card>
          {this.renderCardHeader()}
          {this.renderCardContent()}
          {this.renderCardFooter()}
        </Card>
      </ThemeMixin>
    );
  }
}

export default withIsLoading(ContentCard);
