import { upperFirst } from 'lodash';

import { stringifyClean } from '../../utils/stringify-clean';
import { IFieldDefinition, ISingleErModel } from './model-types';

export function generateFieldDeco(field: IFieldDefinition) {
  const columnArgs = stringifyClean({
    nullable: field.optional || undefined,
  });

  const type = field.type === 'EntityId' ? 'ID' : upperFirst(field.type);

  return `@Field(() => ${type}, ${columnArgs})`;
}

export function getTsTypeName(field: IFieldDefinition) {
  if (field.optional) {
    return `${field.type} | null`;
  }

  return field.type;
}

export function getFieldName(field: IFieldDefinition) {
  if (field.optional) {
    return `${field.name}?`;
  }

  return field.name;
}

export function generateField(field: IFieldDefinition) {
  const columnArgs = stringifyClean({
    nullable: field.optional || undefined,
    type: field.dbType,
  });

  return (
`  @Column(${columnArgs})
  ${generateFieldDeco(field)}
  public ${getFieldName(field)}: ${getTsTypeName(field)};`);
}

export function generateBase(model: ISingleErModel) {
  const baseFields = model.fields.filter((f) => f.visibility === '-');

  return (
`import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ArgsType()
@ObjectType()
export class ${model.name}Base {
${baseFields.map(generateField).join('\n\n')}
}
`);
}
