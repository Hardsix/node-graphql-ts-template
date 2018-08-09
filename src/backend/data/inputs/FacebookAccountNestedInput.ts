import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { UserNestedInput } from './UserNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class FacebookAccountNestedInput {
  @Field(() => ID, { nullable: true })
  public id?: EntityId;

  @Field(() => String, { nullable: true })
  public externalUserId?: string | null;

  @Field(() => UserNestedInput, { nullable: true })
  public user?: UserNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
