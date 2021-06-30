import { useCallback } from 'react';

import { useQuery } from '@apollo/client';

import { useTrack } from '@apollosproject/ui-analytics';

import { share } from '../utils';
import GET_SHARE_CONTENT from './getShareContent';

const useShare = (nodeId, { title, message, url } = {}) => {
  const track = useTrack();

  const { data: { node = {} } = {}, loading } = useQuery(GET_SHARE_CONTENT, {
    variables: { nodeId },
  });

  return useCallback(() => {
    const sharing = node?.sharing || {};

    if (!loading && !sharing?.title && !sharing?.message && !sharing?.url)
      return null;

    const content = {
      id: nodeId,
      title: title || sharing?.title,
      message: message || sharing?.message,
      url: url || sharing?.url,
    };

    track({
      eventName: 'Share',
      properties: content,
    });

    return share(content);
  }, [loading, node, nodeId, title, message, url, track]);
};

export default useShare;
