import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@InputType()
export class UserNestedInput {
  @Field(() => ID)
  public id: EntityId;

  @Field(() => String, { nullable: true })
  public email?: string | null;

  // <keep-methods>
  // </keep-methods>
}
