export const SCRIPTURE_FRAGMENT = gql`
  fragment ScriptureFragment on Scripture {
    id
    html
    reference
    copyright
    version
  }
`;
