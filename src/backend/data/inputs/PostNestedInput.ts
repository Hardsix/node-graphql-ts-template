import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class PostNestedInput {
  @Field(() => ID, { nullable: true })
  public id?: EntityId;

  @Field(() => String, { nullable: true })
  public content?: string | null;

  @Field(() => UserNestedInput, { nullable: true })
  public author?: UserNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
