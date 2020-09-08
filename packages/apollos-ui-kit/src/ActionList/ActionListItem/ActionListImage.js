import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';
import moment from 'moment';
import { H3, H6 } from '../../typography';
import styled from '../../styled';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import { withIsLoading } from '../../isLoading';

const CellImage = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit * 4,
    height: theme.sizing.baseUnit * 4,
    borderRadius: theme.sizing.baseBorderRadius,
    marginRight: theme.sizing.baseUnit,
  }),
  'ui-kit.ActionList.ActionListItem.ActionListImage.CellImage'
)(ConnectedImage);

const CellView = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit * 4,
    height: theme.sizing.baseUnit * 4,
    borderRadius: theme.sizing.baseUnit,
    marginRight: theme.sizing.baseUnit,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  'ui-kit.ActionList.ActionListItem.ActionListImage.CellView'
)(View);

const CellDate = styled(
  ({ theme }) => ({
    color: theme.colors.darkSecondary,
    marginBottom: -theme.sizing.baseUnit / 2,
    textAlign: 'center',
    width: '100%',
  }),
  'ui-kit.ActionList.ActionListItem.ActionListImage.CellDate'
)(H3);

const CellMonth = styled(
  ({ theme }) => ({
    color: theme.colors.darkSecondary,
  }),
  'ui-kit.ActionList.ActionListItem.ActionListImage.CellMonth'
)(H6);

const hasNoImage = (source) => isNull(source) || source === '';

const ActionListImage = ({ isLoading, source, start }) => {
  if (isLoading) {
    return <CellImage />;
  }
  if (hasNoImage(source) && !!start) {
    const date = moment(start);
    return (
      <CellView>
        <CellDate>{date.format('D')}</CellDate>
        <CellMonth>{date.format('MMM')}</CellMonth>
      </CellView>
    );
  }
  return <CellImage source={source} />;
};

ActionListImage.propTypes = {
  source: ImageSourceType,
  isLoading: PropTypes.bool,
  start: PropTypes.string,
};

export default withIsLoading(ActionListImage);
