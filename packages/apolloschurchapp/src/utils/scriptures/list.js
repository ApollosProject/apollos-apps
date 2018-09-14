
function scriptureList({ scripture, commas = true } = {}) {
  console.log("scripture = ", scripture);
  if (!scripture && commas) return '';
  if (!scripture) return [];

  const combo = scripture.map(({ reference }) => (
    `${reference}`
  ));

  if (commas) return combo.join(', ');
  return combo;
}

export default scriptureList;
