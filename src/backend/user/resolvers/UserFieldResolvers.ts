import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';

import { IRequestContext } from '../../../data/IRequestContext';
import { User } from '../User';

@Resolver(User)
export class UserFieldResolvers {
  @FieldResolver((returns) => String)
  public async fullName(
    @Root() user: User,
    @Ctx() ctx: IRequestContext,
  ): Promise<string> {
    return `${user.firstName.trim()} ${user.lastName.trim()}`.trim();
  }
}
