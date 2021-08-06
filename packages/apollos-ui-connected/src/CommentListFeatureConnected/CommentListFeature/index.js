import { Comment, useTheme } from '@apollosproject/ui-kit';
import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

const CommentListFeature = ({ comments, onPressLike, onPressActionMenu }) => {
  const theme = useTheme();
  return (
    <FlatList
      renderItem={({ item }) => (
        <Comment
          onPressLike={onPressLike && (() => onPressLike(item))}
          onPressActionMenu={
            onPressActionMenu && (() => onPressActionMenu(item))
          }
          subtitle={item.person?.campus?.name}
          profile={item.person}
          key={item.id}
          isLiked={item.isLiked}
          commentText={item.text}
        />
      )}
      data={comments}
      // Adds a bit of padding to the last item of the list of comments
      paddingBottom={comments?.length ? theme.sizing.baseUnit : 0}
    />
  );
};

CommentListFeature.propTypes = {
  onPressActionMenu: PropTypes.func,
  onPressLike: PropTypes.func,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      person: PropTypes.shape({
        nickName: PropTypes.string,
        photo: PropTypes.shape({
          uri: PropTypes.string,
        }),
      }),
    })
  ),
};

export default CommentListFeature;
