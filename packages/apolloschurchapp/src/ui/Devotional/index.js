import React from 'react';
import PropTypes from 'prop-types';

import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import ContentTab from 'apolloschurchapp/src/ui/Devotional/ContentTab';
import ScriptureTab from 'apolloschurchapp/src/ui/Devotional/ScriptureTab';

const Devotional = ({
  content: { body, title, ...otherContentProps },
  isLoading,
  scripture,
}) => {
  const hasScripture = isLoading || scripture.length;
  const tabRoutes = [{ title: 'Devotional', key: 'content' }];
  if (hasScripture) tabRoutes.push({ title: 'Scripture', key: 'scripture' });

  return (
    <BackgroundView>
      <TabView
        routes={tabRoutes}
        renderScene={SceneMap({
          content: (
            <ContentTab
              body={body}
              isLoading={isLoading}
              otherContentProps={otherContentProps}
              scripture={scripture}
              title={title}
            />
          ),
          scripture: <ScriptureTab scripture={scripture} />,
        })}
      />
    </BackgroundView>
  );
};

Devotional.propTypes = {
  content: PropTypes.shape({
    body: PropTypes.string,
    title: PropTypes.string,
    otherContentProps: PropTypes.any,
  }),
  isLoading: PropTypes.bool,
  scripture: PropTypes.arrayOf(PropTypes.string),
};

export default Devotional;
