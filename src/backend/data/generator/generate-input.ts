import { generateFieldDeco, getFieldName, getTsTypeName } from './generate-base';
import { IFieldDefinition, ISingleErModel } from './model-types';

function generateField(field: IFieldDefinition) {
  return (
`  ${generateFieldDeco(field)}
  public ${getFieldName(field)}: ${getTsTypeName(field)};`);
}

export function generateInput(model: ISingleErModel) {
  const name = model.name;
  const inputFields = model.fields.filter((f) => f.visibility === 'x');
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one');
  const manyToOneFields = manyToOneRelations.map((r): IFieldDefinition => ({
    dbType: undefined,
    name: `${r.myName}Id`,
    optional: r.optional,
    type: 'EntityId',
    visibility: '',
  }));

  const allInputFields = [...inputFields, ...manyToOneFields];

  return (
`import { ArgsType, Field, ID } from 'type-graphql';

import { ${name}Base } from '../base/${name}Base';
import { EntityId } from '../EntityId';

@ArgsType()
export class ${name}CreateInput extends ${name}Base {
${allInputFields.map(generateField).join('\n\n')}
}
`);
}
