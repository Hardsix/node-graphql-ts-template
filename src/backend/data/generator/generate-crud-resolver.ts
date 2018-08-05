// tslint:disable max-line-length
import { lowerFirst } from 'lodash';
import { plural } from 'pluralize';
import { ISingleErModel } from './model-types';

export function generateCrudResolver(model: ISingleErModel) {
  const modelName = model.name;
  const resourceName = lowerFirst(modelName);

  return (
`// tslint:disable max-line-length
import { Arg, Args, Mutation, Query, Info, ID, Ctx } from 'type-graphql';

import { ${modelName} } from '../models/${modelName}';
import { ${modelName}CreateInput } from '../inputs/${modelName}CreateInput';
import { ${modelName}EditInput } from '../inputs/${modelName}EditInput';
import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
// </keep-imports>


export class ${modelName}CrudResolver {
  @Query((returns) => ${modelName})
  async ${resourceName}(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return await ctx.em.findOne(${modelName}, id, getFindOptions(${modelName}, info));
  }

  @Query((returns) => [${modelName}])
  ${plural(resourceName)}(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(${modelName}, getFindOptions(${modelName}, info));
  }

  @Mutation((returns) => ${modelName})
  async create${modelName}(@Args() input: ${modelName}CreateInput, @Ctx() ctx: IRequestContext): Promise<${modelName}> {
    const model = new ${modelName}();
    await model.update(input, ctx);

    return await ctx.em.save(${modelName}, model);
  }

  @Mutation((returns) => ${modelName})
  async update${modelName}(@Arg('id', () => ID) id: EntityId, @Args() input: ${modelName}EditInput, @Ctx() ctx: IRequestContext) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const model = await ctx.em.findOneOrFail(${modelName}, id);
    await model.update(input, ctx);

    return ctx.em.save(${modelName}, model);
  }

  @Mutation((returns) => Boolean)
  async delete${modelName}(@Arg('id', () => ID) id: EntityId, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(${modelName}, ctx.em.create(${modelName}, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  async delete${plural(modelName)}(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(${modelName}, ids.map((id) => ctx.em.create(${modelName}, { id })));

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
`);
}
