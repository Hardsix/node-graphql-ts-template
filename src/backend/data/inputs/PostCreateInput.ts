import { Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { UserNestedInput } from '../../modules/user/inputs/UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class PostCreateInput {
  @Field(() => String)
  public content: string;

  @Field(() => String)
  public title: string;

  @Field(() => UserNestedInput)
  public author: UserNestedInput;

  // <keep-methods>
  // </keep-methods>
}
