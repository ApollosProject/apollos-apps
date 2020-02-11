import gql from 'graphql-tag';

const SCRIPTURE_FRAGMENT = gql`
  fragment ScriptureFragment on Scripture {
    id
    html
    reference
    copyright
    version
  }
`;

export { SCRIPTURE_FRAGMENT };
