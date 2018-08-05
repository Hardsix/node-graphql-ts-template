import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';
import { UserType } from '../enums/UserType';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class UserCreateInput {
  @Field(() => String)
  public password: string;

  @Field(() => String)
  public email: string;

  @Field(() => UserType)
  public type: UserType;

  @Field(() => ID, { nullable: true })
  public facebookAccountId?: EntityId | null;

  // <keep-methods>
  // </keep-methods>
}
