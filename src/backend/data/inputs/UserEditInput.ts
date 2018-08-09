import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { FacebookAccountNestedInput } from './FacebookAccountNestedInput';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class UserEditInput {
  @Field(() => ID)
  public id: EntityId;

  @Field(() => String, { nullable: true })
  public email?: string | null;

  @Field(() => FacebookAccountNestedInput, { nullable: true })
  public facebookAccount?: FacebookAccountNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
