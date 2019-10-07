const envVariableRegex = /\${(.*?)}/g;

function deepObjectMap(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    // eslint-disable-next-line no-use-before-define
    newObject[key] = handleValue(value);
  });
  return newObject;
}

function handleValue(value) {
  if (typeof value === 'string' && envVariableRegex.test(value)) {
    try {
      const envVariable = value.replace(
        envVariableRegex,
        (match, p1) => process.env[p1]
      );
      // eslint-disable-next-line
      if (!isNaN(Number(envVariable))) {
        return envVariable;
      }
      return JSON.parse(envVariable);
    } catch (e) {
      return value.replace(envVariableRegex, (match, p1) => process.env[p1]);
    }
  }
  if (Array.isArray(value)) {
    return value.map(handleValue);
  }
  if (value != null && typeof value === 'object') {
    return deepObjectMap(value);
  }
  return value;
}

export default deepObjectMap;
