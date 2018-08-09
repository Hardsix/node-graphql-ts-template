import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { FacebookAccountNestedInput } from './FacebookAccountNestedInput';

// <keep-imports>
// </keep-imports>

@InputType()
export class UserNestedInput {
  @Field(() => ID, { nullable: true })
  public id?: EntityId;

  @Field(() => String, { nullable: true })
  public email?: string | null;

  @Field(() => FacebookAccountNestedInput, { nullable: true })
  public facebookAccount?: FacebookAccountNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
