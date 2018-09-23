import { Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { PostNestedInput } from './PostNestedInput';
import { UserNestedInput } from '../../modules/user/inputs/UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class FileNestedInput {
  @Field(() => ID, { nullable: true })
  public id?: EntityId;

  @Field(() => String, { nullable: true })
  public contentBase64?: string | null;

  @Field(() => PostNestedInput, { nullable: true })
  public post?: PostNestedInput | null;

  @Field(() => UserNestedInput, { nullable: true })
  public user?: UserNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
