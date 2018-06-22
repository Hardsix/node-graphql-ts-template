import * as cleanDeep from 'clean-deep';
import { isEmpty } from 'lodash';

export function stringifyClean(obj: object): string {
  const cleaned = cleanDeep(obj);
  if (isEmpty(cleaned)) {
    return '';
  }

  return JSON.stringify(cleaned);
}

export function asLastArgument(x: string) {
  if (x === '') {
    return x;
  }

  return `, ${x}`;
}
