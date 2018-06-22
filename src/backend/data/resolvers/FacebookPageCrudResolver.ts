// tslint:disable max-line-length
import { Arg, Args, ID, Info, Mutation, Query } from 'type-graphql';
import { getManager, getRepository } from 'typeorm';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { FacebookPageCreateInput } from '../inputs/FacebookPageCreateInput';
import { FacebookPage } from '../models/FacebookPage';

export class FacebookPageCrudResolver {
  @Query((returns) => FacebookPage)
  public async facebookPage(@Arg('id', () => ID) id: number, @Info() info) {
    const em = getManager();

    return em.findOne(FacebookPage, id, getFindOptions(FacebookPage, info));
  }

  @Query((returns) => [FacebookPage])
  public facebookPages(@Info() info) {
    const em = getManager();

    return em.find(FacebookPage, getFindOptions(FacebookPage, info));
  }

  @Mutation((returns) => FacebookPage)
  public async createFacebookPage(@Args() input: FacebookPageCreateInput): Promise<FacebookPage> {
    const em = getManager();
    const model = new FacebookPage();
    await model.update(input, { em });

    return em.save(FacebookPage, model);
  }

  @Mutation((returns) => FacebookPage)
  public async updateFacebookPage(@Arg('id', () => ID) id: number, @Args() input: FacebookPageCreateInput) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const em = getManager();
    const model = await em.findOneOrFail(FacebookPage, id);
    await model.update(input, { em });

    return em.save(FacebookPage, model);
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookPage(@Arg('id', () => ID) id: EntityId): Promise<boolean> {
    const em = getManager();
    await em.remove(FacebookPage, em.create(FacebookPage, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteFacebookPages(@Arg('ids', () => [ID]) ids: Array<EntityId>): Promise<boolean> {
    const em = getManager();
    await em.remove(FacebookPage, ids.map((id) => em.create(FacebookPage, { id })));

    return true;
  }
}
