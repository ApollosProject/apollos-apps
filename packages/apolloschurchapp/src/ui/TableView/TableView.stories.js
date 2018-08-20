import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FlexedView from 'apolloschurchapp/src/ui/FlexedView';
import Icon from 'apolloschurchapp/src/ui/Icon';
import { Switch } from 'apolloschurchapp/src/ui/inputs';

import TableView, { Cell, CellText, Divider } from '.';

storiesOf('TableView', module).add('default', () => (
  <FlexedView>
    <TableView>
      <Cell>
        <Icon name="arrow-back" />
        <CellText>Line Item</CellText>
      </Cell>
      <Divider />
      <Cell>
        <Icon name="camera" />
        <CellText>A toggle!</CellText>
        <Switch />
      </Cell>
      <Divider />
      <Cell>
        <CellText>Just a row</CellText>
      </Cell>
      <Divider />
      <Cell>
        <CellText>This be some button!</CellText>
        <Icon name="arrow-next" />
      </Cell>
    </TableView>
  </FlexedView>
));
