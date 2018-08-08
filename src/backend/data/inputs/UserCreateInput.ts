import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class UserCreateInput {
  @Field(() => String)
  public email: string;

  // <keep-methods>
  // </keep-methods>
}
