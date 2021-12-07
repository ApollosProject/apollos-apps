import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  RequestedFollowListConnected,
  SuggestedFollowListConnected,
} from '../FollowListConnected';

import FollowListSearchModalConnected from '../FollowListSearchModalConnected';

const FollowPeopleFeature = ({ refetchRef }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <RequestedFollowListConnected refetchRef={refetchRef} />
      <SuggestedFollowListConnected
        refetchRef={refetchRef}
        onPressFollowListButton={() => setModalOpen(true)}
        followListButtonTitle={'Find People to Follow'}
      />
      <FollowListSearchModalConnected
        open={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

FollowPeopleFeature.propTypes = {
  refetchRef: PropTypes.func,
};

export default FollowPeopleFeature;
