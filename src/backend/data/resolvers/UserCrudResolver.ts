// tslint:disable max-line-length
import { Arg, Args, ID, Info, Mutation, Query } from 'type-graphql';
import { getManager, getRepository } from 'typeorm';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { User } from '../models/User';

export class UserCrudResolver {
  @Query((returns) => User)
  public async user(@Arg('id', () => ID) id: number, @Info() info) {
    const em = getManager();

    return em.findOne(User, id, getFindOptions(User, info));
  }

  @Query((returns) => [User])
  public users(@Info() info) {
    const em = getManager();

    return em.find(User, getFindOptions(User, info));
  }

  @Mutation((returns) => User)
  public async createUser(@Args() input: UserCreateInput): Promise<User> {
    const em = getManager();
    const model = new User();
    await model.update(input, { em });

    return em.save(User, model);
  }

  @Mutation((returns) => User)
  public async updateUser(@Arg('id', () => ID) id: number, @Args() input: UserCreateInput) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const em = getManager();
    const model = await em.findOneOrFail(User, id);
    await model.update(input, { em });

    return em.save(User, model);
  }

  @Mutation((returns) => Boolean)
  public async deleteUser(@Arg('id', () => ID) id: EntityId): Promise<boolean> {
    const em = getManager();
    await em.remove(User, em.create(User, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  public async deleteUsers(@Arg('ids', () => [ID]) ids: Array<EntityId>): Promise<boolean> {
    const em = getManager();
    await em.remove(User, ids.map((id) => em.create(User, { id })));

    return true;
  }
}
