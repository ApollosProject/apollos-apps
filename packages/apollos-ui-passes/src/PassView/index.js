import React from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import {
  Card,
  PaddedView,
  H6,
  H3,
  styled,
  ThemeMixin,
} from '@apollosproject/ui-kit';

import FieldList, { FieldSet, fieldProps } from './Fields';
import Barcode from './Barcode';
import Thumbnail from './Thumbnail';

const PassViewFlex = styled({
  minHeight: Dimensions.get('window').height * 0.55,
  flexDirection: 'column',
  justifyContent: 'space-between',
})(View);

const Description = styled({
  textAlign: 'center',
})(H6);

const PassView = ({
  description = null,
  primaryFields = [],
  secondaryFields = [],
  thumbnail = null,
  backgroundColor,
  foregroundColor,
  labelColor,
  barcode,
  isLoading,
}) => (
  <ThemeMixin
    mixin={{
      colors: {
        paper: backgroundColor,
        text: {
          primary: foregroundColor,
          secondary: labelColor,
        },
      },
    }}
  >
    <Card isLoading={isLoading}>
      <PassViewFlex>
        <View>
          <PaddedView>
            <Description color={foregroundColor} isLoading={isLoading}>
              {description}
            </Description>
          </PaddedView>

          <FieldSet>
            {/* Apple Passes only display the first primary field: */}
            <FieldList
              fields={primaryFields.slice(0, 1)}
              ValueComponent={H3}
              valueColor={foregroundColor}
              labelColor={labelColor}
              isLoading={isLoading}
            />

            {thumbnail ? (
              <Thumbnail source={thumbnail} isLoading={isLoading} />
            ) : null}
          </FieldSet>

          <FieldSet>
            <FieldList
              isLoading={isLoading}
              fields={secondaryFields}
              valueColor={foregroundColor}
              labelColor={labelColor}
            />
          </FieldSet>
        </View>
        {barcode ? <Barcode source={barcode} isLoading={isLoading} /> : null}
      </PassViewFlex>
    </Card>
  </ThemeMixin>
);

PassView.propTypes = {
  description: PropTypes.string,
  primaryFields: PropTypes.arrayOf(PropTypes.shape(fieldProps)),
  secondaryFields: PropTypes.arrayOf(PropTypes.shape(fieldProps)),
  thumbnail: PropTypes.shape({ uri: PropTypes.string }),
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string,
  labelColor: PropTypes.string,
  barcode: PropTypes.shape({ uri: PropTypes.string }),
  isLoading: PropTypes.bool,
};

export default PassView;
