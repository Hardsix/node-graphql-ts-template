// tslint:disable max-line-length
import { Arg, Args, Ctx, ID, Info, Mutation, Query } from 'type-graphql';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { UserEditInput } from '../inputs/UserEditInput';
import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

// <keep-imports>
// </keep-imports>

export class UserCrudResolver {
  @Query((returns) => User)
  public async user(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.findOne(User, id, getFindOptions(User, info));
  }

  @Query((returns) => [User])
  public users(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(User, getFindOptions(User, info));
  }

  @Mutation((returns) => User)
  public async createUser(@Args() input: UserCreateInput, @Ctx() ctx: IRequestContext): Promise<User> {
    const model = new User();
    await model.update(input, ctx);

    return ctx.em.save(User, model);
  }

  @Mutation((returns) => User)
  public async updateUser(@Arg('id', () => ID) id: EntityId, @Args() input: UserEditInput, @Ctx() ctx: IRequestContext) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const model = await ctx.em.findOneOrFail(User, id);
    await model.update(input, ctx);

    return ctx.em.save(User, model);
  }

  @Mutation((returns) => Boolean)
  public async deleteUser(@Arg('id', () => ID) id: EntityId, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(User, ctx.em.create(User, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteUsers(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(User, ids.map((id) => ctx.em.create(User, { id })));

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
