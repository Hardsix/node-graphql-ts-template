import { lowerFirst } from 'lodash';
import { plural } from 'pluralize';
import { ISingleErModel } from './model-types';

export function generateCrudResolver(model: ISingleErModel) {
  const modelName = model.name;
  const resourceName = lowerFirst(modelName);

  return (
`// tslint:disable max-line-length
import { Arg, Args, Mutation, Query, Info, ID } from 'type-graphql';
import { getRepository, getManager } from 'typeorm';

import { ${modelName} } from '../models/${modelName}';
import { ${modelName}CreateInput } from '../inputs/${modelName}CreateInput';
import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';

export class ${modelName}CrudResolver {
  @Query((returns) => ${modelName})
  async ${resourceName}(@Arg('id', () => ID) id: number, @Info() info) {
    const em = getManager();

    return await em.findOne(${modelName}, id, getFindOptions(${modelName}, info));
  }

  @Query((returns) => [${modelName}])
  ${plural(resourceName)}(@Info() info) {
    const em = getManager();

    return em.find(${modelName}, getFindOptions(${modelName}, info));
  }

  @Mutation((returns) => ${modelName})
  async create${modelName}(@Args() input: ${modelName}CreateInput): Promise<${modelName}> {
    const em = getManager();
    const model = new ${modelName}();
    await model.update(input, { em });

    return await em.save(${modelName}, model);
  }

  @Mutation((returns) => ${modelName})
  async update${modelName}(@Arg('id', () => ID) id: number, @Args() input: ${modelName}CreateInput) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const em = getManager();
    const model = await em.findOneOrFail(${modelName}, id);
    await model.update(input, { em });

    return em.save(${modelName}, model);
  }

  @Mutation((returns) => Boolean)
  async delete${modelName}(@Arg('id', () => ID) id: EntityId): Promise<boolean> {
    const em = getManager();
    await em.remove(${modelName}, em.create(${modelName}, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  async delete${plural(modelName)}(@Arg('ids', () => [ID]) ids: Array<EntityId>): Promise<boolean> {
    const em = getManager();
    await em.remove(${modelName}, ids.map((id) => em.create(${modelName}, { id })));

    return true;
  }
}
`);
}
