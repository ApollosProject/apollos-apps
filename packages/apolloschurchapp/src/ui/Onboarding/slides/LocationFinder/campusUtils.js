import gql from 'graphql-tag';

const setCurrentCampus = gql`
  mutation updateCurrentCampus($selected: Boolean!) {
    updateCurrentCampus(selected: $selected) @client
  }
`;

const getCurrentCampusSelected = gql`
  query getCurrentCampus {
    isCurrentCampus @client(always: true)
  }
`;

const requestCurrentCampus = async ({ client, isCurrentCampus }) => {
  await client.mutate({
    mutation: setCurrentCampus,
    variables: { selected: isCurrentCampus },
  });

  return isCurrentCampus;
};

export { requestCurrentCampus, getCurrentCampusSelected };
