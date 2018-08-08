import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class PostCreateInput {
  @Field(() => String)
  public content: string;

  @Field(() => UserNestedInput)
  public author: UserNestedInput;

  // <keep-methods>
  // </keep-methods>
}
