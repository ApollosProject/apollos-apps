import React from 'react';
import { Chip, H6, styled } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';

const ChipText = styled(({ theme, selected }) => {
  return {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: selected ? theme.colors.white : theme.colors.tertiary,
  };
})(H6);

const TagChipButton = styled(({ theme, selected }) => ({
  backgroundColor: selected ? theme.colors.tertiary : theme.colors.paper,
  borderColor: selected ? theme.colors.tertiary : theme.colors.paper,
}))(Chip);

export default function TagChip({ selected, onPress, title }) {
  return (
    <TagChipButton
      type={selected ? 'tertiary' : 'overlay'}
      onPress={onPress}
      selected={selected}
      chipList
    >
      <ChipText selected={selected}>{title}</ChipText>
    </TagChipButton>
  );
}

TagChip.propTypes = {
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  title: PropTypes.string,
};
