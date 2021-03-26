import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Modal, { ModalHeader } from '../../Modal';
import styled from '../../styled';
import FollowListSearch from '.';

const SearchBackground = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.paper,
  }),
  'ui-kit.onFollow.SearchBackground'
)(View);

const FollowListSearchModal = ({
  onSearch,
  open,
  setModalOpen,
  title,
  ...props
}) => {
  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setModalOpen(false)}
      visible={open}
    >
      <SearchBackground>
        <ModalHeader
          onNext={() => setModalOpen(false)}
          onNextText="Done"
          title={title}
        />
        <FollowListSearch onSearch={onSearch} {...props} />
      </SearchBackground>
    </Modal>
  );
};

FollowListSearchModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setModalOpen: PropTypes.func,
  onSearch: PropTypes.func,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  onFollow: PropTypes.func,
  results: PropTypes.arrayOf(PropTypes.object),
};

FollowListSearchModal.defaultProps = {
  title: 'Find People to Follow',
  onSearch: () => {},
  open: false,
};

export default FollowListSearchModal;
