import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  PaddedView,
  H4,
} from '@apollosproject/ui-kit';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView);

const Name = styled({
  flexGrow: 1,
})(View);

const ActionTableFeature = ({ actions, title, onPressItem }) => {
  return (
    <View>
      <RowHeader>
        <Name>
          <H4>{title}</H4>
        </Name>
      </RowHeader>
      <TableView>
        {actions.map((action) => (
          <>
            <Divider />
            <Touchable onPress={() => onPressItem(action)}>
              <Cell>
                <CellText>{action.title}</CellText>
                <CellIcon name="arrow-next" />
              </Cell>
            </Touchable>
          </>
        ))}
      </TableView>
    </View>
  );
};

ActionTableFeature.propTypes = {
  title: PropTypes.string,
  onPressItem: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default ActionTableFeature;
