import { upperFirst } from 'lodash';
import { stringifyClean } from '../../utils/stringify-clean';
import { getEnumName, IFieldDefinition, IModelDefinition, isEnum, ISingleErModel } from './model-types';

export function generateFieldDeco(field: IFieldDefinition) {
  if (field.visibility === '+') {
    return '';
  }

  const columnArgs = stringifyClean({
    nullable: field.optional || undefined,
  });

  const type
    = field.type === 'EntityId' ? 'ID'
    : isEnum(field)             ? getEnumName(field)
                                : upperFirst(field.type);

  return `@Field(() => ${type}, ${columnArgs})`;
}

export function getTsTypeName(field: IFieldDefinition) {
  const type = isEnum(field) ? getEnumName(field) : field.type;

  if (field.optional && !field.notNullable) {
    return `${type} | null`;
  }

  return type;
}

export function getFieldName(field: IFieldDefinition) {
  if (field.optional) {
    return `${field.name}?`;
  }

  return field.name;
}

export function generateEnumsImports(fields: Array<IFieldDefinition>) {
  return fields
    .filter(isEnum)
    .map((field) => `import { ${getEnumName(field)} } from '../enums/${getEnumName(field)}';`)
    .join('\n');
}

export function generateField(field: IFieldDefinition) {
  const columnArgs = stringifyClean({
    nullable: field.optional || undefined,
    type: field.dbType,
    enum: isEnum(field) ? getEnumName(field) : undefined,
  }, ['enum']);

  return (
`  ${generateFieldDeco(field)}
  @Column(${columnArgs})
  public ${getFieldName(field)}: ${getTsTypeName(field)};`);
}

export function generateBase(model: ISingleErModel) {
  const baseFields = model.fields.filter((f) => f.visibility === '-');

  return (
`import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

${generateEnumsImports(model.fields.filter((f) => f.visibility === '-'))}

// <keep-imports>
// </keep-imports>

@ArgsType()
@ObjectType()
export class ${model.name}Base {
${baseFields.map(generateField).join('\n\n')}

  // <keep-methods>
  // </keep-methods>
}
`);
}
