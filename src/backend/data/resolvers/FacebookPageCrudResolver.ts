// tslint:disable max-line-length
import { Arg, Args, Ctx, ID, Info, Mutation, Query } from 'type-graphql';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { FacebookPageCreateInput } from '../inputs/FacebookPageCreateInput';
import { FacebookPageEditInput } from '../inputs/FacebookPageEditInput';
import { IRequestContext } from '../IRequestContext';
import { FacebookPage } from '../models/FacebookPage';

// <keep-imports>
// </keep-imports>

export class FacebookPageCrudResolver {
  @Query((returns) => FacebookPage)
  public async facebookPage(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.findOne(FacebookPage, id, getFindOptions(FacebookPage, info));
  }

  @Query((returns) => [FacebookPage])
  public facebookPages(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(FacebookPage, getFindOptions(FacebookPage, info));
  }

  @Mutation((returns) => FacebookPage)
  public async createFacebookPage(@Args() input: FacebookPageCreateInput, @Ctx() ctx: IRequestContext): Promise<FacebookPage> {
    const model = new FacebookPage();
    await model.update(input, ctx);

    return ctx.em.save(FacebookPage, model);
  }

  @Mutation((returns) => FacebookPage)
  public async updateFacebookPage(@Arg('id', () => ID) id: EntityId, @Args() input: FacebookPageEditInput, @Ctx() ctx: IRequestContext) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const model = await ctx.em.findOneOrFail(FacebookPage, id);
    await model.update(input, ctx);

    return ctx.em.save(FacebookPage, model);
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookPage(@Arg('id', () => ID) id: EntityId, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(FacebookPage, ctx.em.create(FacebookPage, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookPages(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(FacebookPage, ids.map((id) => ctx.em.create(FacebookPage, { id })));

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
