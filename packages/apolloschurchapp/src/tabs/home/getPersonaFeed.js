import gql from 'graphql-tag';

import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';
import { largeCardFragment } from 'apolloschurchapp/src/ui/ContentCardConnected';

export default gql`
  query getPersonaFeed {
    personaFeed {
      edges {
        node {
          ...largeCardFragment
          ...contentItemFragment
        }
      }
    }
  }
  ${contentItemFragment}
  ${largeCardFragment}
`;
