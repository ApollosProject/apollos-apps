import { Text } from 'react-native';

import { styled } from '@apollosproject/ui-kit';

import ScriptureText from './ScriptureText';

const VerseNumber = styled(
  ({ theme }) => ({
    fontSize: theme.helpers.rem(0.6),
    color: theme.colors.text.secondary,
  }),
  'ui-scripture.Scripture.typography.VerseNumber'
)(ScriptureText);

const RedLetters = styled(
  ({ theme }) => ({
    color: theme.colors.wordOfChrist,
  }),
  'ui-scripture.Scripture.typography.RedLetters'
)(Text);

const PoeticPause = styled(
  {
    textAlign: 'right',
  },
  'ui-scripture.Scripture.typography.PoeticPause'
)(ScriptureText);

const LegalText = styled(
  ({ theme }) => ({
    fontSize: theme.helpers.rem(0.6),
    lineHeight: theme.helpers.verticalRhythm(0.45),
    fontFamily: theme.typography.sans.regular.default,
    color: theme.colors.text.secondary,
  }),
  'ui-scripture.Scripture.typography.LegalText'
)(ScriptureText);

export { ScriptureText, VerseNumber, RedLetters, PoeticPause, LegalText };
