import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Switch } from '../inputs';
import styled from '../styled';
import { H4, H5 } from '../typography';

import Comment from '../Comment';

const ContainerScrollView = styled(({ theme }) => ({
  backgroundColor: theme?.colors?.background?.paper,
}))(BottomSheetScrollView);

const SaveButton = styled(
  ({ theme: { colors } }) => ({
    color: colors.action.secondary,
  }),
  'ui-kit.Confirmation.SaveButton'
)(H4);

const Share = styled(
  ({ theme }) => ({
    marginVertical: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit,
    paddingHorizontal: theme.sizing.baseUnit,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.background.accent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.Share'
)(View);
const ShareText = styled(
  () => ({
    flexShrink: 1,
  }),
  'ui-kit.AddCommentInput.ShareText'
)(View);
const ShareDisclaimer = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.AddCommentInput.ShareDisclaimer'
)(H5);

const Confirmation = ({
  navigation,
  profile,
  route,
  onSubmit,
  bottomSheetModalRef,
}) => {
  const [share, setShare] = useState('PUBLIC');
  const [isSubmitting, setSubmitting] = useState(false);

  const onPressSave = useCallback(async () => {
    if (onSubmit) {
      setSubmitting(true);
      await onSubmit(route?.params?.value, share);
      setSubmitting(false);
      bottomSheetModalRef.current.dismiss();
    }
  }, [
    bottomSheetModalRef,
    setSubmitting,
    onSubmit,
    route?.params?.value,
    share,
  ]);

  const headerRight = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => {
      if (isSubmitting) return <ActivityIndicator />;
      return (
        <SaveButton onPress={onPressSave}>
          {share === 'PUBLIC' ? 'Share' : 'Save'}
        </SaveButton>
      );
    },
    [share, isSubmitting, onPressSave]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight,
    });
  }, [navigation, headerRight]);

  return (
    <ContainerScrollView>
      <Comment profile={profile} commentText={route?.params?.value} />
      <Share>
        <ShareText>
          <H4>Share with the Community</H4>
          <ShareDisclaimer>
            Your name and photo will be visible to the community.
          </ShareDisclaimer>
        </ShareText>
        <Switch
          value={share === 'PUBLIC'}
          onValueChange={(value) => setShare(value ? 'PUBLIC' : 'PRIVATE')}
        />
      </Share>
    </ContainerScrollView>
  );
};

Confirmation.propTypes = {
  navigation: PropTypes.shape({ setOptions: PropTypes.func }),
  profile: PropTypes.shape({}),
  route: PropTypes.shape({
    params: PropTypes.shape({ value: PropTypes.string }),
  }),
  onSubmit: PropTypes.func,
  bottomSheetModalRef: PropTypes.shape({
    current: PropTypes.shape({
      close: PropTypes.func,
      dismiss: PropTypes.func,
    }),
  }),
};

export default Confirmation;
