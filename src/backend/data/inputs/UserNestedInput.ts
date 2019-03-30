/*** AUTOGENERATED FILE: you can only modify parts of the file within <keep-*> tags ***/
import { Field, ID, InputType } from 'type-graphql';

import { EntityId, EntityIdScalar } from '../EntityId';
import { UserRole } from '../enums/UserRole';
import { FileNestedInput } from './FileNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class UserNestedInput {
  @Field(() => EntityIdScalar, { nullable: true })
  public id?: EntityId;

  @Field(() => String, { nullable: true })
  public email?: string | null;

  @Field(() => String, { nullable: true })
  public password?: string | null;

  @Field(() => String, { nullable: true })
  public firstName?: string | null;

  @Field(() => String, { nullable: true })
  public lastName?: string | null;

  @Field(() => FileNestedInput, { nullable: true })
  public profileImage?: FileNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
