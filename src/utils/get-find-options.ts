import * as getFieldNames from 'graphql-list-fields';
import { intersection, takeWhile } from 'lodash';
import { getRepository } from 'typeorm';

const beforeDot = (x: string) => takeWhile(x, (ch) => ch !== '.').join('');

export function getRelations(EntityType, queryInfo): Array<string> {
  const propertyNames = getRepository(EntityType).metadata.relations.map((r) => r.propertyName);
  const fields = getFieldNames(queryInfo);

  return intersection(propertyNames, fields.map(beforeDot));
}

export function getFindOptions(EntityType, info, context = {}) {
  const relations = getRelations(EntityType, info);

  return { relations };
}
