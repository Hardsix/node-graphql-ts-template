export function findBetween(
  data: string,
  start: string,
  end: string) {
  const startIndex = data.indexOf(start);
  if (startIndex < 0) {
    return undefined;
  }

  const endIndex = data.indexOf(end, startIndex);
  if (endIndex < 0) {
    return undefined;
  }

  return data.substring(startIndex + start.length, endIndex);
}

export function replaceBetween(data: string, start: string, end: string, replacement: string) {
  const startIndex = data.indexOf(start);
  if (startIndex < 0) {
    return data;
  }

  const endIndex = data.indexOf(end, startIndex);
  if (endIndex < 0) {
    return data;
  }

  const firstPart = data.substring(0, startIndex + start.length);
  const lastPart = data.substring(endIndex);

  return `${firstPart}${replacement}${lastPart}`;
}
