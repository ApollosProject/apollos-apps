import React from 'react';
import { withProps } from 'recompose';

import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import DevotionalTab from 'apolloschurchapp/src/ui/Devotional/DevotionalTab';
import ScriptureTab from 'apolloschurchapp/src/ui/Devotional/SriptureTab';

const Devotional = ({
  content: {
    body,
    title,
    ...otherContentProps
  },
  isLoading,
  scripture,
}) => {
  const hasScripture = isLoading || scripture.length;
  const tabRoutes = [{ title: 'Devotional', key: 'devotional' }];
  console.log("hasScripture = ", hasScripture);
  if (hasScripture) tabRoutes.push({ title: 'Scripture', key: 'scripture' });

  return (
    <BackgroundView>
      <TabView
        routes={tabRoutes}
        renderScene={SceneMap({
          devotional: withProps({
            body,
            isLoading,
            otherContentProps,
            scripture,
            title,
          })(DevotionalTab),
          scripture: withProps({
            scripture,
          })(ScriptureTab),
        })}
      >
      </TabView>
    </BackgroundView>
  )
}
