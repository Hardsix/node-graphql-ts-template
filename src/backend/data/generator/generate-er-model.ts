// tslint:disable max-line-length
import { kebabCase, lowerFirst, sortedUniq } from 'lodash';
import { FieldDefinition, SingleErModel, SingleErRelation } from './parse-er-model';

export function generateTypeImport(type: string) {
  return `import { ${type} } from './${type}';`;
}

export function generateOneToManyDeclarations(relations: Array<SingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) =>
`  @OneToMany((type) => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName})
  @Field((returns) => [${r.otherTypeName}])
  public ${r.myName}: Promise<Array<${r.otherTypeName}>>;`).join('\n\n');
}

export function generateManyToOneDeclarations(relations: Array<SingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) =>
`  @ManyToOne((type) => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName})
  @Field((returns) => ${r.otherTypeName})
  public ${r.myName}: Promise<${r.otherTypeName}>;`).join('\n\n');
}

export function generateTypesImports(types: Array<string>) {
  return types.map(generateTypeImport).join('\n');
}

export function generateField(field: FieldDefinition) {
  const columnArgs = field.dbType === undefined ? '' : `{ type: '${field.dbType}' }`;

  return (
`  @Column(${columnArgs})
  public ${field.name}: ${field.type};`);
}

function getFieldName(relation: SingleErRelation) {
  return `${relation.myName}Id`;
}

export function generateToOneInitialization(relation: SingleErRelation) {
  const fieldName = getFieldName(relation);

  return (
`    this.${relation.myName} = Promise.resolve(await context.em.getRepository(${relation.otherTypeName}).findOneOrFail(${fieldName}));`
  );
}

export function generateDestructureStatement(relations: Array<SingleErRelation>) {
  const destructureStatement = relations.map(getFieldName);
  if (destructureStatement.length === 0) {
    return `const data = input`;
  } else {
    return `const { ${destructureStatement.join(', ')}, ...data } = input;`;
  }
}

export function generateSingleModel(model: SingleErModel) {
  const name = model.name;
  const types = sortedUniq(model.relations.map((r) => r.otherTypeName));

  const oneToManyRelations = model.relations.filter((r) => r.relationType === 'many');
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one');

  const dbOnlyFields = model.fields.filter((f) => f.visibility === '+');

  return (
`import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { assign } from 'lodash';

${generateTypesImports(types)}
import { ${name}Base } from '../base/${name}Base';
import { ${name}CreateInput } from '../inputs/${name}CreateInput';
import { IRequestContext } from '../IRequestContext';
import { update${name}Model } from '../services/${kebabCase(name)}-services';

@Entity()
@ObjectType()
export class ${name} extends ${name}Base {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

${dbOnlyFields.map(generateField).join('\n\n')}

${generateManyToOneDeclarations(manyToOneRelations)}

${generateOneToManyDeclarations(oneToManyRelations)}

  public async update(input: ${name}CreateInput, context: IRequestContext) {
    ${generateDestructureStatement(manyToOneRelations)}
    assign(this, data);

${manyToOneRelations.map(generateToOneInitialization).join('\n\n')}
    await update${name}Model(this, input, context);
  }
}
`);
}
