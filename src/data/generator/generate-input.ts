// tslint:disable max-line-length
import { FieldDefinition, parseErModel, SingleErModel } from './parse-er-model';

function generateField(field: FieldDefinition) {
  return (
`  @Field()
  public ${field.name}: ${field.type};`);
}

export function generateInput(model: SingleErModel) {
  const name = model.name;
  const inputFields = model.fields.filter((f) => f.visibility === 'x');
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one');
  const manyToOneFields = manyToOneRelations.map((r): FieldDefinition => ({
    dbType: undefined,
    name: `${r.myName}Id`,
    type: 'number',
    visibility: '',
  }));

  const allInputFields = [...inputFields, ...manyToOneFields];

  return (
`import { ArgsType, Field } from 'type-graphql';
import { ${name}Base } from '../base/${name}Base';

@ArgsType()
export class ${name}CreateInput extends ${name}Base {
${allInputFields.map(generateField).join('\n\n')}
}
`);
}
