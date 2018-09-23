import { Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { PostNestedInput } from './PostNestedInput';
import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class FileCreateInput {
  @Field(() => String)
  public contentBase64: string;

  @Field(() => PostNestedInput, { nullable: true })
  public post?: PostNestedInput | null;

  @Field(() => UserNestedInput, { nullable: true })
  public user?: UserNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
