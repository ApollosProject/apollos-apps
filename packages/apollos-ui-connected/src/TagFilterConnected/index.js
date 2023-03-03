import React from 'react';
import { withTheme, named } from '@apollosproject/ui-kit';
import { gql, useQuery } from '@apollo/client';
import { ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import TagChip from './TagChip';

const ChipsContainer = withTheme(
  ({ theme }) => ({
    contentContainerStyle: {
      paddingTop: theme.sizing.baseUnit,
      paddingLeft: theme.sizing.baseUnit,
      flexGrow: 0,
    }, // using flexGrow here keeps the PrayerCard input above the keyboard as the input grows.
  }),
  'ui-connected.TagsFilter.ChipsContainer'
)(ScrollView);

function TagFilterConnected({ filteredTags, setFilteredTags, allTagsText }) {
  const { data: { contentItemTags } = {} } = useQuery(
    gql`
      {
        contentItemTags
      }
    `,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  function deselectAllTags() {
    setFilteredTags([]);
  }

  function onPressTag(tag) {
    if (filteredTags.includes(tag)) {
      setFilteredTags(
        filteredTags.filter((filteredTag) => filteredTag !== tag)
      );
    } else {
      setFilteredTags([...filteredTags, tag]);
    }
  }
  if (contentItemTags) {
    return (
      <View>
        <ChipsContainer horizontal>
          <TagChip
            title={allTagsText}
            onPress={deselectAllTags}
            selected={filteredTags.length === 0}
          />
          {contentItemTags.map((tag) => (
            <TagChip
              key={tag}
              onPress={() => onPressTag(tag)}
              title={tag}
              selected={filteredTags.includes(tag)}
            />
          ))}
        </ChipsContainer>
      </View>
    );
  }

  return null;
}

TagFilterConnected.propTypes = {
  filteredTags: PropTypes.arrayOf(PropTypes.string),
  setFilteredTags: PropTypes.func,
  allTagsText: PropTypes.string,
};

TagFilterConnected.defaultProps = {
  allTagsText: 'All Causes',
};

export default named('ui-connected.TagFilterConnected')(TagFilterConnected);
