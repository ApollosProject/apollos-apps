/* eslint-disable react-native/split-platform-components */
import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert, Platform, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { useTrack } from '@apollosproject/ui-analytics';
import { AddCommentInput } from '@apollosproject/ui-kit';
import GET_COMMENT_LIST_FEATURE from './getCommentListFeature';
import GET_CURRENT_PERSON_PROFILE from './getCurrentPersonProfile';
import FLAG_COMMENT from './flagComment';
import LIKE_COMMENT from './likeComment';
import UNLIKE_COMMENT from './unlikeComment';
import UPDATE_COMMENT from './updateComment';
import DELETE_COMMENT from './deleteComment';
import CommentListFeature from './CommentListFeature';

const presentActionOptions = (
  options,
  { title, destructiveButtonIndex = 0 }
) => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...options.map(({ text }) => text), 'Cancel'],
        destructiveButtonIndex,
        cancelButtonIndex: options.length,
        title,
      },
      (buttonIndex) => {
        if (options[buttonIndex]?.callback) {
          options[buttonIndex].callback();
        }
      }
    );
  } else {
    Alert.alert(title, null, [
      ...options.map(({ text, callback }) => ({
        text,
        onPress: callback,
      })),
      {
        text: 'Cancel',
        onPress: () => ({}),
        style: 'cancel',
      },
    ]);
  }
};

const removeCommentFromCache = (cache, { commentId, featureId }) => {
  // Let's get started! No crashing allowed.
  try {
    // Let's find our comment list.
    const commentListFeature = cache.readQuery({
      query: GET_COMMENT_LIST_FEATURE,
      variables: { featureId },
    });

    // Now let's remove our flagged comment from that comment list.
    cache.writeQuery({
      query: GET_COMMENT_LIST_FEATURE,
      variables: { featureId },
      data: {
        ...commentListFeature,
        node: {
          ...commentListFeature.node,
          comments: commentListFeature.node.comments.filter(
            ({ id }) => id !== commentId
          ),
        },
      },
    });
  } catch (e) {
    console.warn('Failed to update cache after deleeting comment', e);
  }
};

function CommentListFeatureConnected({
  featureId,
  Component,
  isLoading,
  refetchRef,
  ...props
}) {
  const { data, loading, refetch } = useQuery(GET_COMMENT_LIST_FEATURE, {
    variables: { featureId },
    fetchPolicy: 'cache-and-network',
  });

  const { data: profileData } = useQuery(GET_CURRENT_PERSON_PROFILE, {
    variables: { featureId },
  });

  const currentPerson = profileData?.currentUser?.profile;
  const node = data?.node;

  const [flagComment] = useMutation(FLAG_COMMENT, {
    update: (
      cache,
      {
        data: {
          flagComment: { id },
        },
      }
    ) => removeCommentFromCache(cache, { commentId: id, featureId }),
  });
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [unlikeComment] = useMutation(UNLIKE_COMMENT);

  const [updateComment] = useMutation(UPDATE_COMMENT);

  const track = useTrack();

  const bottomSheetModalRef = useRef(null);
  const [editingComment, setEditingComment] = useState();

  const handlePressLike = ({ isLiked, id, ...rest }) => {
    track({
      eventName: `Comment ${isLiked ? 'Unliked' : 'Liked'}`,
      properties: {
        commentId: id,
      },
    });
    if (isLiked) {
      unlikeComment({
        variables: { commentId: id },
        optimisticResponse: {
          __typename: 'Mutation',
          unlikeComment: {
            __typename: 'Comment',
            id,
            isLiked: !isLiked,
            ...rest,
          },
        },
      });
    } else {
      likeComment({
        variables: { commentId: id },
        optimisticResponse: {
          __typename: 'Mutation',
          likeComment: {
            __typename: 'Comment',
            id,
            isLiked: !isLiked,
            ...rest,
          },
        },
      });
    }
  };

  const handlePressActionMenu = ({ id: commentId, person, ...comment }) => {
    if (person.id === currentPerson?.id) {
      // Actions for the current person's comments.
      presentActionOptions(
        [
          {
            callback: () => {
              setEditingComment({ id: commentId, ...comment });
              bottomSheetModalRef.current.present();
            },
            text: 'Edit',
          },
          {
            callback: () => {
              deleteComment({
                variables: { commentId },
                update: (cache) =>
                  removeCommentFromCache(cache, { commentId, featureId }),
              });
            },
            text: 'Delete',
          },
        ],
        {
          title: 'Comment Options',
          destructiveButtonIndex: 1,
        }
      );
    } else {
      // Actions for for everyone else's comments.
      presentActionOptions(
        [
          {
            callback: () => {
              track({
                eventName: 'Comment Flagged',
                properties: {
                  commentId,
                },
              });
              flagComment({ variables: { commentId } });
            },
            text: 'Report as inappropriate.',
          },
        ],
        {
          title: 'Report',
        }
      );
    }
  };

  if (featureId && refetch && refetchRef)
    refetchRef({ refetch, id: featureId });

  return (
    <>
      <Component
        {...node}
        {...props}
        isLoading={loading || isLoading}
        onPressActionMenu={handlePressActionMenu}
        onPressLike={handlePressLike}
      />
      <AddCommentInput
        name={'edit'}
        openBottomSheetOnMount={false}
        showInlinePrompt={false}
        prompt={'Edit'}
        editorTitle={'Edit Journal'}
        confirmationTitle={'Update Journal'}
        initialValue={editingComment?.text}
        profile={currentPerson}
        showCancel
        bottomSheetModalRef={bottomSheetModalRef}
        onSubmit={async (text, visibility) => {
          const updatedComment = await updateComment({
            variables: { text, visibility, commentId: editingComment.id },
          });
          // It's a bummer that we need this here.
          // The editor is supposed to handle it, but for whatever reason it doens't work consistently.
          bottomSheetModalRef.current.dismiss();
          return updatedComment;
        }}
        fullscreen
      />
    </>
  );
}

CommentListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

CommentListFeatureConnected.defaultProps = {
  Component: CommentListFeature,
};

export default CommentListFeatureConnected;
