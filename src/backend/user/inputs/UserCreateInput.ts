import { Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';
import { UserRole } from '../enums/UserRole';

import { FileNestedInput } from './FileNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class UserCreateInput {
  @Field(() => String, { nullable: true })
  public email?: string | null;

  @Field(() => String)
  public password: string;

  @Field(() => String)
  public firstName: string;

  @Field(() => String)
  public lastName: string;

  @Field(() => String, { nullable: true })
  public fullName?: string | null;

  @Field(() => FileNestedInput, { nullable: true })
  public profileImage?: FileNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
