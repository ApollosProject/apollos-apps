import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import Tabs from './Tabs';

const GET_USER_CAMPUS_ID = gql`
  query GetUserCampusID {
    currentUser {
      id
      profile {
        id
        campus {
          id
        }
      }
    }
  }
`;

const GET_TABS = gql`
  query GetTabs($campusId: ID) {
    tabs(campusId: $campusId) {
      title
      icon
      feed {
        id
      }
      config {
        logo
        search
        profile
        tagList
      }
    }
  }
`;

const TabsConnected = ({ hasCampus }) => {
  const { data: campusData, loading, error } = useQuery(GET_USER_CAMPUS_ID);
  const { data } = useQuery(GET_TABS, {
    variables: {
      campusId: hasCampus ? campusData?.currentUser?.profile?.campus?.id : null,
    },
    fetchPolicy: 'cache-and-network',
  });
  if (error) {
    return null;
  }
  if (loading) {
    return <ActivityIndicator />;
  }
  return <Tabs tabs={data?.tabs ?? []} />;
};

TabsConnected.propTypes = {
  hasCampus: PropTypes.bool,
};

TabsConnected.defaultProps = {
  hasCampus: false,
};

export default TabsConnected;
