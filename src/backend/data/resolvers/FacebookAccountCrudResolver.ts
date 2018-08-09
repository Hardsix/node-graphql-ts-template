// tslint:disable max-line-length
import { Arg, Args, Ctx, ID, Info, Mutation, Query } from 'type-graphql';

import { addEagerFlags } from '../../utils/add-eager-flags';
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
    return addEagerFlags(await ctx.em.findOne(FacebookAccount, id, getFindOptions(FacebookAccount, info)));
  }

  @Query((returns) => [FacebookAccount])
  public async facebookAccounts(@Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.find(FacebookAccount, getFindOptions(FacebookAccount, info)));
  }

  @Mutation((returns) => FacebookAccount)
  public async createFacebookAccount(@Args() input: FacebookAccountCreateInput, @Ctx() ctx: IRequestContext): Promise<FacebookAccount> {
    const model = new FacebookAccount();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => FacebookAccount)
  public async updateFacebookAccount(@Args() input: FacebookAccountEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(FacebookAccount, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookAccounts(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(FacebookAccount, ids.map((id) => ctx.em.create(FacebookAccount, { id })));

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
