import React, { Children } from 'react';
import { Text, View } from 'react-native';
import { decodeHTML } from 'entities';
import { get } from 'lodash';
import {
  BodyText,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  BlockQuote,
  BulletListItem,
  OrderedListItem,
  ButtonLink,
  ConnectedImage,
  ScriptureLink,
} from '@apollosproject/ui-kit';

const LINE_BREAK = '\n';
const TEXT_TYPES_THAT_SHOULD_WRAP = [Text, BodyText, ButtonLink, ScriptureLink];
const ILLEGAL_TEXT_CHILDREN_TYPES = [ConnectedImage, View];

// Detects if the image urls are relative.
// Example /images/foo.png vs //rock.com/images/foo.png
export const isLocalImg = (src) => src.startsWith('/') && !src.startsWith('//');

export const stripIllegalMarkup = (children) =>
  Children.toArray(children).filter(
    (child) => !ILLEGAL_TEXT_CHILDREN_TYPES.includes(child.type)
  );

export const wrapTextChildren = ({
  children,
  Component = BodyText,
  strip = true,
}) => {
  const newChildren = [];
  let currentTextChildren = [];
  Children.toArray(children).forEach((child, i) => {
    if (TEXT_TYPES_THAT_SHOULD_WRAP.includes(child.type)) {
      currentTextChildren.push(child);
    } else {
      if (currentTextChildren.length) {
        newChildren.push(
          // eslint-disable-next-line
          <Component key={`composed-children-${i}`}>
            {currentTextChildren}
          </Component>
        );
        currentTextChildren = [];
      }
      newChildren.push(child);
    }
  });
  if (currentTextChildren.length) {
    newChildren.push(
      <Component key="composed-children">{currentTextChildren}</Component>
    );
  }
  if (strip) {
    return stripIllegalMarkup(newChildren);
  }
  return newChildren;
};

const defaultRenderer = (node, { children }, handlePressAnchor) => {
  const blockElements = ['p', 'div', 'blockquote'];
  if (node.type === 'text' && node.data) {
    const text = decodeHTML(node.data);
    const blankText = !text.trim();

    if (
      blankText &&
      ((node.next && !blockElements.includes(node.next.name)) ||
        (node.prev && !blockElements.includes(node.prev.name)))
    ) {
      // If the text is blank, but it's beside other text, include it.
      // Think: two spans with a space between them.
      return <Text>{text}</Text>;
    }

    if (!node.parent && !blankText) {
      // If the text top level, show it inside a body text element.
      return <BodyText>{text}</BodyText>;
    }
    if (!blankText) {
      return <Text>{text}</Text>;
    }
  }
  const keepPadding =
    node.children?.filter((child) => child.name === 'scripture').length == 0;
  switch (node.name) {
    case 'scripture':
      return (
        <ScriptureLink verse={node.attribs.verse}>{children}</ScriptureLink>
      );
    case 'div':
      return <View>{wrapTextChildren({ children, strip: false })}</View>;
    case 'p':
      return (
        <Paragraph>{wrapTextChildren({ children, strip: false })}</Paragraph>
      );
    case 'strong':
      return <BodyText bold>{children}</BodyText>;
    // NOTE: remove if Rock decides to stop using <b> in its content GUI
    case 'b':
      return <BodyText bold>{children}</BodyText>;
    case 'em':
      return <BodyText italic>{children}</BodyText>;
    // NOTE: remove if Rock decides to stop using <i> in its content GUI
    case 'i':
      return <BodyText italic>{children}</BodyText>;
    case 'blockquote':
      return (
        <BlockQuote>
          {wrapTextChildren({ children, Component: BodyText, strip: false })}
        </BlockQuote>
      );
    case 'h1':
      return (
        <H1 padded={keepPadding}>
          {wrapTextChildren({ children, Component: Text })}
        </H1>
      );
    case 'h2':
      return (
        <H2 padded={keepPadding}>
          {wrapTextChildren({ children, Component: Text })}
        </H2>
      );
    case 'h3':
      return (
        <H3 padded={keepPadding}>
          {wrapTextChildren({ children, Component: Text })}
        </H3>
      );
    case 'h4':
      return (
        <H4 padded={keepPadding}>
          {wrapTextChildren({ children, Component: Text })}
        </H4>
      );
    case 'h5':
      return (
        <H5 padded={keepPadding}>
          {wrapTextChildren({ children, Component: Text })}
        </H5>
      );
    case 'h6':
      return (
        <H6 padded={keepPadding}>
          {wrapTextChildren({ children, Component: Text })}
        </H6>
      );
    case 'ul':
      return <Paragraph>{children}</Paragraph>;
    case 'li':
      if (node.parent.name === 'ol') {
        const siblings = node.parent.children.filter(
          ({ name }) => name === 'li'
        );
        // We are lucky this works.
        // Thankfully the parser library has done the work to ensure that objects are not recreated in different contexts.
        // Because of that, the current node and the node as represented in it's parent's children are ===
        const selfIndex = siblings.findIndex((s) => s === node) + 1;
        return (
          <OrderedListItem index={selfIndex}>
            {wrapTextChildren({ children })}
          </OrderedListItem>
        );
      }
      return <BulletListItem>{wrapTextChildren({ children })}</BulletListItem>;
    case 'a': {
      let url = node.attribs && node.attribs.href;
      url = decodeHTML(url);

      if (url && url.startsWith('//')) {
        url = `http:${url}`;
      }
      const onPress = () => handlePressAnchor(url);
      if (url) {
        return (
          <ButtonLink onPress={onPress}>
            {wrapTextChildren({ children, Component: Text })}
          </ButtonLink>
        );
      }
    }
    /* ignoring fallthrough on the next line because of the conditional return above,
     * so we handle the edge-case of an <a> tag used w/o a href
     */
    case 'img': {
      const source = {
        url: node.attribs.src,
      };

      if (source.url && isLocalImg(source.url)) {
        return null;
      }

      const imgStyles = {
        resizeMode: 'contain',
        width: '100%',
      };

      return (
        <ConnectedImage maintainAspectRatio source={source} style={imgStyles} />
      );
    }
    case 'br':
      // the conditional logic in this function aims to mimic HTML's white-space collapsing
      // the only block-level element we currently support
      if ((node.next && node.prev) || (!node.next && !node.prev)) {
        if (node.parent && blockElements.includes(node.parent.name)) {
          return (
            <View>
              <BodyText />
            </View>
          );
        }
        return <BodyText>{LINE_BREAK}</BodyText>;
      }
      return null;
    default:
      return children;
  }
};

export default defaultRenderer;
