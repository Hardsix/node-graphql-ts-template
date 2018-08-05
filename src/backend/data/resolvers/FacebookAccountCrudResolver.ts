// tslint:disable max-line-length
import { Arg, Args, Ctx, ID, Info, Mutation, Query } from 'type-graphql';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { FacebookAccountCreateInput } from '../inputs/FacebookAccountCreateInput';
import { FacebookAccountEditInput } from '../inputs/FacebookAccountEditInput';
import { IRequestContext } from '../IRequestContext';
import { FacebookAccount } from '../models/FacebookAccount';

// <keep-imports>
// </keep-imports>

export class FacebookAccountCrudResolver {
  @Query((returns) => FacebookAccount)
  public async facebookAccount(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.findOne(FacebookAccount, id, getFindOptions(FacebookAccount, info));
  }

  @Query((returns) => [FacebookAccount])
  public facebookAccounts(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(FacebookAccount, getFindOptions(FacebookAccount, info));
  }

  @Mutation((returns) => FacebookAccount)
  public async createFacebookAccount(@Args() input: FacebookAccountCreateInput, @Ctx() ctx: IRequestContext): Promise<FacebookAccount> {
    const model = new FacebookAccount();
    await model.update(input, ctx);

    return ctx.em.save(FacebookAccount, model);
  }

  @Mutation((returns) => FacebookAccount)
  public async updateFacebookAccount(@Arg('id', () => ID) id: EntityId, @Args() input: FacebookAccountEditInput, @Ctx() ctx: IRequestContext) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const model = await ctx.em.findOneOrFail(FacebookAccount, id);
    await model.update(input, ctx);

    return ctx.em.save(FacebookAccount, model);
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookAccount(@Arg('id', () => ID) id: EntityId, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(FacebookAccount, ctx.em.create(FacebookAccount, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookAccounts(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(FacebookAccount, ids.map((id) => ctx.em.create(FacebookAccount, { id })));

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
