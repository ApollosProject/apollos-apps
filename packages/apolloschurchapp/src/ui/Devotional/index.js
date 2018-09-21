import React from 'react';
import PropTypes from 'prop-types';

import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import DevotionalTab from 'apolloschurchapp/src/ui/Devotional/DevotionalTab';
import ScriptureTab from 'apolloschurchapp/src/ui/Devotional/ScriptureTab';

const Devotional = ({
  content: { body, title, ...otherContentProps },
  isLoading,
  scripture,
}) => {
  const hasScripture = isLoading || scripture.length;
  const tabRoutes = [{ title: 'Devotional', key: 'devotional' }];
  if (hasScripture) tabRoutes.push({ title: 'Scripture', key: 'scripture' });

  return (
    <BackgroundView>
      <TabView
        routes={tabRoutes}
        renderScene={SceneMap({
          devotional: (
            <DevotionalTab
              body={body}
              isLoading={isLoading}
              otherContentProps={otherContentProps}
              scripture={scripture}
              title={title}
            />
          ),
          scripture: (
            <ScriptureTab isLoading={isLoading} scripture={scripture} />
          ),
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
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      reference: PropTypes.string,
      html: PropTypes.string,
    })
  ),
};

export default Devotional;
