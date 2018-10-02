import React from 'react';
import { withProps } from 'recompose';
import { Text, Platform } from 'react-native';

import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import defaultRenderer, {
  wrapTextChildren,
} from 'apolloschurchapp/src/ui/HTMLView/defaultRenderer';
import Paragraph from 'apolloschurchapp/src/ui/typography/Paragraph';
import { H4, SerifText } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';

const RedLetters = styled(({ theme }) => ({
  color: theme.colors.wordOfChrist,
}))(Text);

const VerseNumber = styled(({ theme }) => ({
  fontSize: theme.helpers.rem(0.6),
  color: theme.colors.text.secondary,
}))(SerifText);

const PoeticPause = styled({
  textAlign: 'right',
})(SerifText);

const renderer = (node, { children, ...other }) => {
  // the defaultRenderer support several basic elements out of the box,
  // this function only needs to handle the cases that are unique to scripture.
  const className = (node && node.attribs && node.attribs.class) || '';

  /* Verse numbers
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_chapters-verses.scss#L33
   */
  if (className.includes('v')) {
    /* TODO: a single space before and importantly a non-breaking space (`\u00A0`) after wraps the number to
     * temporarily space verse numbers when they are not at the beginning of a sentence or
     * paragraph. It affects all instences (albeit less noticably in some cases) so a more procise
     * fix in the future is prefered.
     */
    return (
      <VerseNumber>
        {' '}
        {children}
        {`\u00A0`}
      </VerseNumber>
    );
  }

  /* Speaker identification and descriptive titles ("Hebrew subtitle")
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_titles-headings.scss#L109-L126
   */
  if (className.includes('sp') || className.includes('d')) {
    return <H4 padded>{children}</H4>;
  }

  /* Indented poetic line These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L2
   */
  if (className.includes('q1')) {
    return (
      <SerifText>
        {'     '}
        {children}
      </SerifText>
    );
  }

  /* Double indented poetic lines. These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L7
   */
  if (className.includes('q2')) {
    return (
      <SerifText>
        {'          '}
        {children}
      </SerifText>
    );
  }

  /* Triple indented poetic lines. These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L8
   */
  if (className.includes('q3')) {
    return (
      <SerifText>
        {'               '}
        {children}
      </SerifText>
    );
  }

  /* Quadruple indented poetic lines. These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L9
   */
  if (className.includes('q4')) {
    return (
      <SerifText>
        {'                    '}
        {children}
      </SerifText>
    );
  }

  if (className.includes('wj')) {
    return <RedLetters>{children}</RedLetters>;
  }

  /* Poetic pause ("Selah"). Highly conditional rendering due to Android not supporting nested text
   * alignment (https://github.com/facebook/react-native/issues/18790) and needing to keep it
   * somewhat attractive. TODO: revisit conditional code when issue is resolved or if we refactor
   * the parser
   *
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L22
   */
  if (className.includes('qs')) {
    return (
      <PoeticPause>
        {Platform.OS === 'ios' ? `\n` : null}
        {children}
        {Platform.OS === 'ios' ? `\n` : `\n\n`}
      </PoeticPause>
    );
  }

  if (node.name === 'p') {
    return (
      <Paragraph>
        <SerifText>{wrapTextChildren(children, SerifText)}</SerifText>
      </Paragraph>
    );
  }

  return defaultRenderer(node, { children, ...other });
};

const ScriptureHTMLView = withProps({
  renderer,
})(HTMLView);

export default ScriptureHTMLView;
