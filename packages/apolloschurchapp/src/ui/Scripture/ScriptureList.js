import React from 'react';
import PropTypes from 'prop-types';
import { H4 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import { ButtonLink } from 'apolloschurchapp/src/ui/Button';

const StyledH4 = styled(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  textDecorationLine: 'underline',
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H4);

const ScriptureList = ({ scripture, onPress, commas = true }) => {
  if (!scripture && commas) return '';
  if (!scripture) return [];

  let combo = scripture.map(({ reference }) => `${reference}`);

  if (commas) {
    combo = combo.join(', ');
  }

  const handleOnPress = () => onPress('scripture');

  return (
    <StyledH4>
      <ButtonLink padded onPress={handleOnPress}>
        {combo}
      </ButtonLink>
    </StyledH4>
  );
};

ScriptureList.propTypes = {
  onPress: PropTypes.func,
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      reference: PropTypes.string,
      html: PropTypes.string,
    })
  ),
  commas: PropTypes.bool,
};

export default ScriptureList;
