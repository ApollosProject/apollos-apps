import React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader } from '../../Modal';
import FollowListSearch from '.';

const FollowListSearchModal = ({
  onSearch,
  onHide,
  onConfirm,
  onFollow,
  results,
  open,
  setModalOpen,
  title,
}) => {
  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setModalOpen(false)}
      visible={open}
    >
      <ModalHeader
        onNext={() => setModalOpen(false)}
        onNextText="Done"
        title={title}
      />
      <FollowListSearch
        onSearch={onSearch}
        results={results}
        onHide={onHide}
        onConfirm={onConfirm}
        onFollow={onFollow}
      />
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
  onHide: () => {},
  onConfirm: () => {},
  onFollow: () => {},
  results: [],
  open: false,
};

export default FollowListSearchModal;
