// tslint:disable max-line-length
import { kebabCase, lowerFirst, sortedUniq } from 'lodash';

import { asLastArgument, stringifyClean } from '../../utils/stringify-clean';
import { generateField } from './generate-base';
import { ISingleErModel, ISingleErRelation } from './model-types';

export function generateTypeImport(type: string) {
  return `import { ${type} } from './${type}';`;
}

export function generateOneToManyDeclarations(relations: Array<ISingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) =>
`  @OneToMany((type) => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName})
  @Field((returns) => [${r.otherTypeName}])
  public ${r.myName}: Promise<Array<${r.otherTypeName}>>;`).join('\n\n');
}

export function generateRelationArgs(relation: ISingleErRelation) {
  const relationsArgs = stringifyClean({
    nullable: relation.optional,
    onDelete: relation.optional ? 'SET NULL' : 'CASCADE',
  });

  return asLastArgument(relationsArgs);
}

export function generateFieldArgs(relation: ISingleErRelation) {
  const relationsArgs = stringifyClean({
    nullable: relation.optional,
  });

  return asLastArgument(relationsArgs);
}

export function getRelationName(r: ISingleErRelation) {
  return r.myName;
}

export function getRelationOtherTypeName(r: ISingleErRelation) {
  if (r.optional) {
    return `${r.otherTypeName} | undefined | null`;
  } else {
    return r.otherTypeName;
  }
}

export function generateManyToOneDeclarations(relations: Array<ISingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) =>
`  @ManyToOne((type) => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName} ${generateRelationArgs(r)})
  @Field((returns) => ${r.otherTypeName} ${generateFieldArgs(r)})
  public ${getRelationName(r)}: Promise<${getRelationOtherTypeName(r)}>;`).join('\n\n');
}

export function generateTypesImports(types: Array<string>) {
  return types.map(generateTypeImport).join('\n');
}

function getFieldName(relation: ISingleErRelation) {
  return `${relation.myName}Id`;
}

export function generateToOneInitialization(relation: ISingleErRelation) {
  const fieldName = getFieldName(relation);

  return (
`    this.${relation.myName} = Promise.resolve(await context.em.findOneOrFail(${relation.otherTypeName}, ${fieldName}));`
  );
}

export function generateNullableToOneInitialization(relation: ISingleErRelation) {
  if (!relation.optional) {
    return generateToOneInitialization(relation);
  }

  const fieldName = getFieldName(relation);

  return (
`    if (${fieldName} !== undefined) {
      this.${relation.myName} = Promise.resolve(${fieldName} ? await context.em.findOneOrFail(${relation.otherTypeName}, ${fieldName}) : null);
    }
`
  );
}

export function generateDestructureStatement(relations: Array<ISingleErRelation>) {
  const destructureStatement = relations.map(getFieldName);
  if (destructureStatement.length === 0) {
    return `const data = input`;
  } else {
    return `const { ${destructureStatement.join(', ')}, ...data } = input;`;
  }
}

export function generateSingleModel(model: ISingleErModel) {
  const name = model.name;
  const types = sortedUniq(model.relations.map((r) => r.otherTypeName));

  const oneToManyRelations = model.relations.filter((r) => r.relationType === 'many');
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one');

  const dbOnlyFields = model.fields.filter((f) => f.visibility === '+');

  return (
`// tslint:disable max-line-length
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { assign } from 'lodash';

${generateTypesImports(types)}
import { ${name}Base } from '../base/${name}Base';
import { ${name}CreateInput } from '../inputs/${name}CreateInput';
import { IRequestContext } from '../IRequestContext';
import { update${name}Model } from '../services/${kebabCase(name)}-services';
import { EntityId } from '../EntityId';

@Entity()
@ObjectType()
export class ${name} extends ${name}Base {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: EntityId;

${dbOnlyFields.map(generateField).join('\n\n')}

${generateManyToOneDeclarations(manyToOneRelations)}

${generateOneToManyDeclarations(oneToManyRelations)}

  public async update(input: ${name}CreateInput, context: IRequestContext) {
    ${generateDestructureStatement(manyToOneRelations)}
    assign(this, data);

${manyToOneRelations.map(generateNullableToOneInitialization).join('\n\n')}
    await update${name}Model(this, input, context);
  }
}
`);
}
