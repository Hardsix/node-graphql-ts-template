import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class FacebookAccountCreateInput {
  @Field(() => String)
  public externalUserId: string;

  @Field(() => UserNestedInput)
  public user: UserNestedInput;

  // <keep-methods>
  // </keep-methods>
}
