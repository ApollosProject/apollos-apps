import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import PaddedView from '../PaddedView';
import FlexedView from '../FlexedView';
import Icon from '../Icon';
import { Switch } from '../inputs';

import TableView, { Cell, CellText, Divider, Row } from './index';

storiesOf('ui-kit/TableView', module).add('Basic Table', () => (
  <FlexedView>
    <PaddedView />
    <TableView headerText="Header Text" footerText="Footer Text">
      <Row
        leadingIcon="camera"
        title="Standard Row"
        subtitle="With an accessory text"
        accessoryText="Hello"
      />
      <Divider />
      <Row
        leadingIcon={false}
        title="Disable the Icon"
        subtitle="Looks pretty neat!"
        accessoryText="32"
      />
      <Divider />
      <Row
        leadingIcon="camera"
        title="Custom Accessory Demo"
        accessoryComponent={<Icon name="umbrella" />}
      />
    </TableView>
  </FlexedView>
));

storiesOf('ui-kit/TableView', module).add('Custom Table', () => (
  <FlexedView>
    <PaddedView />
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
