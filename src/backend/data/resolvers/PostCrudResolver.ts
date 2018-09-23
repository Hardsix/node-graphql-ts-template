// tslint:disable max-line-length
import { Arg, Args, Ctx, FieldResolver, ID, Info, Mutation, Query, Resolver, Root } from 'type-graphql';

import { addEagerFlags } from '../../utils/add-eager-flags';
import * as auth from '../../utils/auth/auth-checkers';
import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { PostEditInput } from '../inputs/PostEditInput';
import { IRequestContext } from '../IRequestContext';
import { Post } from '../models/Post';

// <keep-imports>
// </keep-imports>

@Resolver(Post)
export class PostCrudResolver {
  @Query((returns) => Post)
  public async post(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.findOne(Post, id, getFindOptions(Post, info)));
  }

  @Query((returns) => [Post])
  public async posts(@Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.find(Post, getFindOptions(Post, info)));
  }

  @Mutation((returns) => Post)
  public async createPost(@Arg('input') input: PostCreateInput, @Ctx() ctx: IRequestContext): Promise<Post> {
    const model = new Post();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Post)
  public async updatePost(@Arg('input') input: PostEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(Post, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Boolean)
  public async deletePosts(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    const entities = await ctx.em.findByIds(Post, ids);
    await auth.assertCanDelete(entities, ctx);
    await ctx.em.remove(entities);

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
