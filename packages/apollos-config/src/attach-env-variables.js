const envVariableRegex = /\${(.*?)}/g;

function deepObjectMap(object, env) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    // eslint-disable-next-line no-use-before-define
    newObject[key] = handleValue(value, env);
  });
  return newObject;
}

function handleValue(value, env = process.env) {
  if (typeof value === 'string' && envVariableRegex.test(value)) {
    const envVariable = value.replace(envVariableRegex, (match, p1) => env[p1]);
    // set undefined variables to null so they eval falsy
    if (envVariable === 'undefined') return null;
    try {
      if (!Number.isNaN(Number(envVariable))) {
        return envVariable;
      }
      return JSON.parse(envVariable);
    } catch (e) {
      return envVariable;
    }
  }
  if (Array.isArray(value)) {
    return value.map((v) => handleValue(v, env));
  }
  if (value != null && typeof value === 'object') {
    return deepObjectMap(value, env);
  }
  return value;
}

export default deepObjectMap;
