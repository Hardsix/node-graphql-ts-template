// tslint:disable max-line-length
import { Arg, Args, ID, Info, Mutation, Query } from 'type-graphql';
import { getManager, getRepository } from 'typeorm';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { Post } from '../models/Post';

export class PostCrudResolver {
  @Query((returns) => Post)
  public async post(@Arg('id', () => ID) id: number, @Info() info) {
    const em = getManager();

    return em.findOne(Post, id, getFindOptions(Post, info));
  }

  @Query((returns) => [Post])
  public posts(@Info() info) {
    const em = getManager();

    return em.find(Post, getFindOptions(Post, info));
  }

  @Mutation((returns) => Post)
  public async createPost(@Args() input: PostCreateInput): Promise<Post> {
    const em = getManager();
    const model = new Post();
    await model.update(input, { em });

    return em.save(Post, model);
  }

  @Mutation((returns) => Post)
  public async updatePost(@Arg('id', () => ID) id: number, @Args() input: PostCreateInput) {
    delete input['id']; // because type-graphql injects unneeded id field here
    const em = getManager();
    const model = await em.findOneOrFail(Post, id);
    await model.update(input, { em });

    return em.save(Post, model);
  }

  @Mutation((returns) => Boolean)
  public async deletePost(@Arg('id', () => ID) id: EntityId): Promise<boolean> {
    const em = getManager();
    await em.remove(Post, em.create(Post, { id }));

    return true;
  }

  @Mutation((returns) => Boolean)
  public async deletePosts(@Arg('ids', () => [ID]) ids: Array<EntityId>): Promise<boolean> {
    const em = getManager();
    await em.remove(Post, ids.map((id) => em.create(Post, { id })));

    return true;
  }
}
