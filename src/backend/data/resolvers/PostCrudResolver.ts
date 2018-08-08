// tslint:disable max-line-length
import { Arg, Args, Ctx, ID, Info, Mutation, Query } from 'type-graphql';

import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { PostEditInput } from '../inputs/PostEditInput';
import { IRequestContext } from '../IRequestContext';
import { Post } from '../models/Post';

// <keep-imports>
// </keep-imports>

export class PostCrudResolver {
  @Query((returns) => Post)
  public async post(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.findOne(Post, id, getFindOptions(Post, info));
  }

  @Query((returns) => [Post])
  public posts(@Info() info, @Ctx() ctx: IRequestContext) {
    return ctx.em.find(Post, getFindOptions(Post, info));
  }

  @Mutation((returns) => Post)
  public async createPost(@Args() input: PostCreateInput, @Ctx() ctx: IRequestContext): Promise<Post> {
    const model = new Post();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Post)
  public async updatePost(@Args() input: PostEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(Post, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Boolean)
  public async deletePosts(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    await ctx.em.remove(Post, ids.map((id) => ctx.em.create(Post, { id })));

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
