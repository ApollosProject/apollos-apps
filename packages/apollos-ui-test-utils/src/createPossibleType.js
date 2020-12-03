import possibleTypesJson from './fragmentTypes.json';

export default function createPossibleType({ possibleTypes = {} } = {}) {
  const finalPossibleTypes = {};
  possibleTypesJson.__schema.types.forEach((supertype) => {
    if (supertype.possibleTypes) {
      finalPossibleTypes[supertype.name] = [
        ...supertype.possibleTypes.map((subtype) => subtype.name),
        ...(possibleTypes[supertype.name] || []),
      ];
    }
  });
  return finalPossibleTypes;
}
