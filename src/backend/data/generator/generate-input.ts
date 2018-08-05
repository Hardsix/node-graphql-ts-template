import { identity, upperFirst } from 'lodash';
import { generateEnumsImports, generateFieldDeco, getFieldName, getTsTypeName } from './generate-base';
import { IFieldDefinition, ISingleErModel } from './model-types';

function generateField(field: IFieldDefinition) {
  return (
`  ${generateFieldDeco(field)}
  public ${getFieldName(field)}: ${getTsTypeName(field)};`);
}

function makeOptional(field: IFieldDefinition): IFieldDefinition {
  return {
    ...field,
    optional: true,
  };
}

export function generateInput(model: ISingleErModel, type: 'edit' | 'create') {
  const name = model.name;

  const transform = type === 'edit' ? makeOptional : identity;

  const inputFields = model.fields.filter((f) => f.visibility !== '+').map(transform);
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'many');
  const manyToOneFields = manyToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: `${r.myName}Id`,
    optional: r.optional,
    type: 'EntityId',
    visibility: '',
    modelName: name,
  })).map(transform);

  const oneToOneRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one');
  const oneToOneFields = oneToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: `${r.myName}Id`,
    optional: r.optional || r.isFirst,
    type: 'EntityId',
    visibility: '',
    modelName: name,
  })).map(transform);

  const allInputFields = [...inputFields, ...manyToOneFields, ...oneToOneFields];

  return (
`import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';
${generateEnumsImports(model.fields)}

// <keep-imports>
// </keep-imports>

@ArgsType()
export class ${name}${upperFirst(type)}Input {
${allInputFields.map(generateField).join('\n\n')}

  // <keep-methods>
  // </keep-methods>
}
`);
}
