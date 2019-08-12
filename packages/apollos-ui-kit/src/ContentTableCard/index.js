import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import TableView from '../TableView';
import Card, { CardContent } from '../Card';
import styled from '../styled';
import { withIsLoading } from '../isLoading';

import ContentTableCardItem from './ContentTableCardItem';

const Header = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(CardContent);

const Content = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

class ContentTableCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
      })
    ),
    header: PropTypes.element,
  };

  handleOnPress = ({ action, relatedNode: { id } }) => {
    const { onPress } = this.props;

    if (action === 'READ_CONTENT') {
      onPress({ id });
    }
  };

  render() {
    const { isLoading, content, header: headerContent } = this.props;

    return (
      <Card isLoading={isLoading}>
        <Header>{headerContent}</Header>
        <Content>
          {content.map((item) => (
            <ContentTableCardItem
              key={item.id}
              id={item.id}
              onPress={() => this.handleOnPress(item)}
              label={item.subtitle || ''}
              title={item.title || ''}
              imageSource={get(item, 'image.sources', '')}
            />
          ))}
        </Content>
      </Card>
    );
  }
}

export default withIsLoading(ContentTableCard);
