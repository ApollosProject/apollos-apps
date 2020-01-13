export const TEXT_FEATURE_FRAGMENT = `
fragment TextFeatureFragment on TextFeature {
  body
  id
  sharing {
    message
  }
}
`;

export const SCRIPTURE_FEATURE_FRAGMENT = `
fragment ScriptureFeatureFragment on ScriptureFeature {
  sharing {
    message
  }
  scriptures {
    id
    html
    reference
    copyright
    version
  }
}
`;
