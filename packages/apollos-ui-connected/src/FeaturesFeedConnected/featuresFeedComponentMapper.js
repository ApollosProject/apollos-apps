import React from 'react';
import PropTypes from 'prop-types';

import { named } from '@apollosproject/ui-kit';
import ActionListFeatureConnected from '../ActionListFeatureConnected';
import HorizontalCardListFeatureConnected from '../HorizontalCardListFeatureConnected';
import VerticalCardListFeatureConnected from '../VerticalCardListFeatureConnected';
import HeroListFeatureConnected from '../HeroListFeatureConnected';
import PrayerListFeatureConnected from '../PrayerListFeatureConnected';
import VerticalPrayerListFeatureConnected from '../VerticalPrayerListFeatureConnected';
import ActionBarFeatureConnected from '../ActionBarFeatureConnected';
import ActionTableFeatureConnected from '../ActionTableFeatureConnected';
import ScriptureFeature from '../features/ScriptureFeature';
import TextFeature from '../features/TextFeature';
import WebviewFeature from '../features/WebviewFeature';
import ButtonFeature from '../features/ButtonFeature';
import CommentListFeatureConnected from '../CommentListFeatureConnected';
import AddCommentFeatureConnected from '../AddCommentFeatureConnected';

const MAPPINGS = {
  ActionListFeature: ActionListFeatureConnected,
  HeroListFeature: HeroListFeatureConnected,
  HorizontalCardListFeature: HorizontalCardListFeatureConnected,
  VerticalCardListFeature: VerticalCardListFeatureConnected,
  ActionBarFeature: ActionBarFeatureConnected,
  ActionTableFeature: ActionTableFeatureConnected,
  // TODO: HMW set this up so that features that depend on other packages,
  // like Prayer, don't all get stuck here, forcing all church apps to have
  // them all installed?
  PrayerListFeature: PrayerListFeatureConnected,
  VerticalPrayerListFeature: VerticalPrayerListFeatureConnected,
  CommentListFeature: CommentListFeatureConnected,
  AddCommentFeature: AddCommentFeatureConnected,
  ScriptureFeature,
  TextFeature,
  WebviewFeature,
  ButtonFeature,
};

const featuresFeedComponentMapper = ({
  feature,
  onPressActionItem,
  additionalFeatures = {},
  refetchRef,
}) => {
  const { id, __typename, ...featureData } = feature;
  const map = { ...MAPPINGS, ...additionalFeatures };
  const Component = map[__typename];

  if (Component) {
    return (
      <Component
        featureId={id}
        onPressItem={onPressActionItem}
        listKey={id}
        refetchRef={refetchRef}
        {...featureData}
      />
    );
  }

  console.warn(
    `No feature found for ${__typename}. Do you need to pass it in via the additionalFeatures prop?`
  );
  return null;
};

featuresFeedComponentMapper.propTypes = {
  feature: PropTypes.shape({
    userFeedFeatures: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  onPressActionItem: PropTypes.func,
  additionalFeatures: PropTypes.shape({}),
  refetchRef: PropTypes.func.isRequired,
};

export default named('ui-connected.FeaturesFeed.FeatureFeedComponentMapper')(
  featuresFeedComponentMapper
);
