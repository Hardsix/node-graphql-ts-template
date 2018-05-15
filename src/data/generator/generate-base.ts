import { FieldDefinition, SingleErModel } from './parse-er-model';

function generateField(field: FieldDefinition) {
  const columnArgs = field.dbType === undefined ? '' : `{ type: '${field.dbType}' }`;

  return (
`  @Column(${columnArgs})
  @Field()
  public ${field.name}: ${field.type};`);
}

export function generateBase(model: SingleErModel) {
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
