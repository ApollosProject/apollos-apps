import React, { useState, useCallback, useRef } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackgroundView, styled } from '@apollosproject/ui-kit';
import {
  SuggestedFollowListConnected,
  RequestedFollowListConnected,
} from '../FollowListConnected';
import FollowListSearchModalConnected from '../FollowListSearchModalConnected';

const FlexedSafeAreaView = styled(
  { flex: 1 },
  'ui-connected.ConnectScreenConnected.FlexedSafeAreaView'
)(SafeAreaView);

const ConnectScreenConnected = (props) => {
  const { ActionBar, ActionTable, children } = props;

  const refetchFunctions = useRef({});
  const [isRefetching, setIsRefetching] = useState(false);

  const refetchRef = useCallback(({ id, refetch }) => {
    refetchFunctions.current[id] = refetch;
  });

  const handleRefetch = async () => {
    if (!isRefetching) {
      setIsRefetching(true);
      try {
        await Promise.all(
          Object.values(refetchFunctions.current).map((refetchFn) =>
            refetchFn()
          )
        );
      } catch (e) {
        console.warn(e);
      }
      setIsRefetching(false);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <BackgroundView>
        <FlexedSafeAreaView edges={['left', 'right']}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefetch}
              />
            }
          >
            {ActionBar && <ActionBar />}
            <RequestedFollowListConnected refetchRef={refetchRef} />
            <SuggestedFollowListConnected
              refetchRef={refetchRef}
              onPressFollowListButton={() => setModalOpen(true)}
              followListButtonTitle={'Find People to Follow'}
            />

            {ActionTable && <ActionTable />}
            {children}
          </ScrollView>
        </FlexedSafeAreaView>
      </BackgroundView>
      <FollowListSearchModalConnected
        open={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

ConnectScreenConnected.propTypes = {
  ActionBar: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // covers Fragments
  ]),
  ActionTable: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.object, // covers Fragments
  ]),
};

export default ConnectScreenConnected;
