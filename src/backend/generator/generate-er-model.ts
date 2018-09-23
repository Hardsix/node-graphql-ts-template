// tslint:disable max-line-length
import { kebabCase, lowerFirst, sortedUniq } from 'lodash';

import { asLastArgument, stringifyClean } from '../utils/stringify-clean';
import { generateEnumsImports, generateField } from './generate-base';
import { IGeneratorContext } from './generator-context';
import { getEnumName, isEnum, ISingleErModel, ISingleErRelation } from './model-types';

export function generateTypeImport(type: string) {
  return `import { ${type} } from './${type}';`;
}

export function generateOneToOneOwnerDeclarations(relations: Array<ISingleErRelation>) {
  const nullableRelations: Array<ISingleErRelation> = relations.map((r) => ({ ...r, optional: true }));

  return nullableRelations.map((r) =>
`  @OneToOne((type) => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName})
  @Field((returns) => ${r.otherTypeName} ${generateFieldArgs(r)})
  public ${getRelationName(r)}: Promise<${getRelationOtherTypeName(r)}>;
`);
}

export function generateOneToOneSecondaryDeclarations(relations: Array<ISingleErRelation>) {
  if (relations.length === 0) {
    return '';
  }

  return relations.map((r) => {
    return (
`  @OneToOne((type) => ${r.otherTypeName}, (${lowerFirst(r.otherTypeName)}) => ${lowerFirst(r.otherTypeName)}.${r.otherName} ${generateRelationArgs(r)})
  @Field((returns) => ${r.otherTypeName} ${generateFieldArgs(r)})
  @JoinColumn()
  public ${getRelationName(r)}: Promise<${getRelationOtherTypeName(r)}>;
`); }).join('\n\n');
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
  return relation.myName;
}

export function generateToOneInitialization(relation: ISingleErRelation) {
  const fieldName = getFieldName(relation);

  return (
`    if (${fieldName}) {
      this.${relation.myName} = fakePromise(await context.em.findOneOrFail(${relation.otherTypeName}, ${fieldName}));
    }`
  );
}

export function generateNullableToOneInitialization(relation: ISingleErRelation) {
//  if (!relation.optional) {
//    return generateToOneInitialization(relation);
//  }

  const fieldName = getFieldName(relation);

  return (
`    if (${fieldName} === null) {
      ${relation.optional ? `this.${relation.myName} = Promise.resolve(null);` : `throw new Error('${relation.myTypeName}.${relation.myName} cannot be null')`}
    } else if (${fieldName} === undefined) {
      // do nothing
    } else if (${fieldName}.id) {
      const ${fieldName}Model = await context.em.findOneOrFail(${relation.otherTypeName}, ${fieldName}.id);
      this.${relation.myName} = fakePromise(await ${fieldName}Model.update(${fieldName}, context));
    } else {
      this.${relation.myName} = fakePromise(await new ${relation.otherTypeName}().update(${fieldName}, context));
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

export function generateSingleModel(model: ISingleErModel, ctx: IGeneratorContext) {
  const name = model.name;
  const types = sortedUniq(model.relations.map((r) => r.otherTypeName));

  const oneToManyRelations = model.relations.filter((r) => r.relationType === 'many' && r.otherRelationType === 'one');
  const manyToOneRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'many');
  const oneToOneOwnerRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one' && r.isFirst);
  const oneToOneSecondaryRelations = model.relations.filter((r) => r.relationType === 'one' && r.otherRelationType === 'one' && !r.isFirst);

  const dbFields = model.fields.filter((f) => f.visibility === '+' || f.visibility === '-');

  return (
`// tslint:disable max-line-length no-duplicate-imports
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, JoinColumn, Entity, OneToOne, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { assign } from 'lodash';

${generateTypesImports(types)}
${generateEnumsImports(model.fields)}
import * as auth from '../../utils/auth/auth-checkers';
import { ${name}CreateInput } from '../inputs/${name}CreateInput';
import { ${name}EditInput } from '../inputs/${name}EditInput';
import { ${name}NestedInput } from '../inputs/${name}NestedInput';
import { IRequestContext } from '../IRequestContext';
import { IAuthorizable } from '../../utils/auth/IAuthorizable';
import { EntityId } from '../EntityId';
import { fixId } from '../../utils/fix-id';
import { ${name}Auth } from '../auth/${name}Auth';
import { fakePromise } from '../../utils/fake-promise';

// <keep-imports>
// </keep-imports>

// <keep-decorators>
// </keep-decorators>
@Entity()
@ObjectType()
export class ${name} implements IAuthorizable {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: EntityId;

  public authorizationChecker = new ${name}Auth(this);

${dbFields.map(generateField(ctx)).join('\n\n')}

${generateManyToOneDeclarations(manyToOneRelations)}

${generateOneToManyDeclarations(oneToManyRelations)}

${generateOneToOneOwnerDeclarations(oneToOneOwnerRelations)}
${generateOneToOneSecondaryDeclarations(oneToOneSecondaryRelations)}

  public async update(input: ${name}CreateInput | ${name}EditInput | ${name}NestedInput, context: IRequestContext) {
    fixId(input);
    ${generateDestructureStatement([...manyToOneRelations, ...oneToOneOwnerRelations, ...oneToOneSecondaryRelations])}
    if (this.id && 'id' in input && Object.keys(input).length > 1) {
      await auth.assertCanUpdate(this, context);
    }
    assign(this, data);

${manyToOneRelations.map(generateNullableToOneInitialization).join('\n\n')}
${oneToOneOwnerRelations.map(generateNullableToOneInitialization).join('\n\n')}
${oneToOneSecondaryRelations.map(generateNullableToOneInitialization).join('\\n\\n')}

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    // </keep-update-code>
    if (!('id' in input)) {
      await auth.assertCanCreate(this, context);
    }

    return this;
  }

  // <keep-methods>
  // </keep-methods>
}
`);
}
