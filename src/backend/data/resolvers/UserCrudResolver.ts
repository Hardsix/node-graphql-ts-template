// tslint:disable max-line-length
import { Arg, Args, Ctx, FieldResolver, ID, Info, Mutation, Query, Resolver, Root } from 'type-graphql';

import { addEagerFlags } from '../../utils/add-eager-flags';
import * as auth from '../../utils/auth/auth-checkers';
import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { UserEditInput } from '../inputs/UserEditInput';
import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

// <keep-imports>
// </keep-imports>

@Resolver(User)
export class UserCrudResolver {
  @Query((returns) => User)
  public async user(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.findOne(User, id, getFindOptions(User, info)));
  }

  @Query((returns) => [User])
  public async users(@Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.find(User, getFindOptions(User, info)));
  }

  @Mutation((returns) => User)
  public async createUser(@Arg('input') input: UserCreateInput, @Ctx() ctx: IRequestContext): Promise<User> {
    const model = new User();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => User)
  public async updateUser(@Arg('input') input: UserEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(User, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Boolean)
  public async deleteUsers(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    const entities = await ctx.em.findByIds(User, ids);
    await auth.assertCanDelete(entities, ctx);
    await ctx.em.remove(entities);

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
