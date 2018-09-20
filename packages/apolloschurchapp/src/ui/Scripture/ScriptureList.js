import React from 'react';
import { H4 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import { ButtonLink } from 'apolloschurchapp/src/ui/Button';

const StyledH4 = styled(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  textDecorationLine: 'underline',
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H4);

const ScriptureList = ({ scripture, jumpTo, commas = true }) => {
  if (!scripture && commas) return '';
  if (!scripture) return [];

  let combo = scripture.map(({ reference }) => `${reference}`);

  if (commas) {
    combo = combo.join(', ');
  }

  return (
    <StyledH4>
      <ButtonLink padded onPress={() => jumpTo('scripture')}>
        {combo}
      </ButtonLink>
    </StyledH4>
  );
};

export default ScriptureList;
