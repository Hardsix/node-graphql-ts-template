// tslint:disable max-line-length
import { Arg, Args, Ctx, FieldResolver, ID, Info, Mutation, Query, Resolver, Root } from 'type-graphql';

import { addEagerFlags } from '../../utils/add-eager-flags';
import * as auth from '../../utils/auth/auth-checkers';
import { getFindOptions } from '../../utils/get-find-options';
import { EntityId } from '../EntityId';
import { FileCreateInput } from '../inputs/FileCreateInput';
import { FileEditInput } from '../inputs/FileEditInput';
import { IRequestContext } from '../IRequestContext';
import { File } from '../models/File';

// <keep-imports>
// </keep-imports>

@Resolver(File)
export class FileCrudResolver {
  @Query((returns) => File)
  public async file(@Arg('id', () => ID) id: number, @Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.findOne(File, id, getFindOptions(File, info)));
  }

  @Query((returns) => [File])
  public async files(@Info() info, @Ctx() ctx: IRequestContext) {
    return addEagerFlags(await ctx.em.find(File, getFindOptions(File, info)));
  }

  @Mutation((returns) => File)
  public async createFile(@Arg('input') input: FileCreateInput, @Ctx() ctx: IRequestContext): Promise<File> {
    const model = new File();
    await model.update(input, ctx);

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => File)
  public async updateFile(@Arg('input') input: FileEditInput, @Ctx() ctx: IRequestContext) {
    const model = await ctx.em.findOneOrFail(File, input.id);
    await model.update(input, ctx);

    // <keep-update-code>
    // </keep-update-code>

    await ctx.em.save(ctx.modelsToSave);

    return model;
  }

  @Mutation((returns) => Boolean)
  public async deleteFiles(@Arg('ids', () => [ID]) ids: Array<EntityId>, @Ctx() ctx: IRequestContext): Promise<boolean> {
    const entities = await ctx.em.findByIds(File, ids);
    await auth.assertCanDelete(entities, ctx);
    await ctx.em.remove(entities);

    return true;
  }

  // <keep-methods>
  // </keep-methods>
}
