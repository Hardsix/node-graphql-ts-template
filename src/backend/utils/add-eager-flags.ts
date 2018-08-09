export function addEagerFlags(object) {
  if (typeof object !== 'object' || !object) {
    return object;
  }

  for (const key of Object.keys(object)) {
    if (key.startsWith('__')) {
      object[`__has${key.slice(1)}`] = true;
    }

    if (typeof object[key] === 'object') {
      addEagerFlags(object[key]);
    }
  }

  return object;
}
