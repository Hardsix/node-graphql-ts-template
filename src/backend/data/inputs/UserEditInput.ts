import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';
import { UserType } from '../enums/UserType';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class UserEditInput {
  @Field(() => String, { nullable: true })
  public password?: string | null;

  @Field(() => String, { nullable: true })
  public email?: string | null;

  @Field(() => UserType, { nullable: true })
  public type?: UserType | null;

  @Field(() => ID, { nullable: true })
  public facebookAccountId?: EntityId | null;

  // <keep-methods>
  // </keep-methods>
}
