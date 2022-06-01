import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import {
  ActionCard,
  PaddedView,
  named,
  Touchable,
  H4,
} from '@apollosproject/ui-kit';
import ShareButtonConnected from '../ShareButtonConnected';

const ScriptureFeature = ({
  contentId,
  featureId,
  isCard,
  isLoading,
  nodeId,
  scriptures,
  sharing: { message } = {},
  showShareButton,
  title,
}) => {
  const Wrapper = (
    { children } // eslint-disable-line react/prop-types
  ) =>
    // eslint-disable-next-line no-nested-ternary
    isCard ? (
      showShareButton ? (
        <ActionCard
          label={title}
          icon={'text'}
          action={
            <ShareButtonConnected
              message={message}
              itemId={nodeId || contentId || featureId}
            />
          }
        >
          {children}
        </ActionCard>
      ) : (
        <ActionCard label={title} icon={'text'}>
          {children}
        </ActionCard>
      )
    ) : (
      <PaddedView>{children}</PaddedView>
    );
  const navigation = useNavigation();
  return scriptures.map((scripture) => (
    <Touchable
      onPress={() => {
        navigation.navigate('Scripture', { ...scripture, isLoading });
      }}
      key={scripture.id}
    >
      <Wrapper>
        <H4>{scripture.reference}</H4>
      </Wrapper>
    </Touchable>
  ));
};

ScriptureFeature.defaultProps = {
  isCard: true,
  showShareButton: false,
};

ScriptureFeature.propTypes = {
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  scriptures: PropTypes.arrayOf(
    PropTypes.shape({
      html: PropTypes.string.isRequired,
      reference: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      copyright: PropTypes.string,
      version: PropTypes.string,
    })
  ),
  sharing: PropTypes.shape({ message: PropTypes.string }),
  contentId: PropTypes.string,
  title: PropTypes.string,
  nodeId: PropTypes.string,
  featureId: PropTypes.string,
  showShareButton: PropTypes.bool,
};

export default named('ui-connected.ScriptureFeature')(ScriptureFeature);
