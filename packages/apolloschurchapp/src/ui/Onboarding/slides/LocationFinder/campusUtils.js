import gql from 'graphql-tag';

const setCurrentCampus = gql`
  mutation updateCurrentCampus($selected: Boolean!) {
    updateCurrentCampus(selected: $selected) @client
  }
`;

const getCurrentCampus = gql`
  query getCurrentCampus {
    isCurrentCampus @client(always: true)
  }
`;

const requestCurrentCampus = async ({ client }) => {
  const isCurrentCampus = true;
  await client.mutate({
    mutation: setCurrentCampus,
    variables: { selected: isCurrentCampus },
  });

  return isCurrentCampus;
};

export { requestCurrentCampus, getCurrentCampus };
