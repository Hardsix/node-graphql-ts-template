import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { EntityId } from '../EntityId';

import { FacebookAccountNestedInput } from './FacebookAccountNestedInput';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class UserCreateInput {
  @Field(() => String)
  public email: string;

  @Field(() => FacebookAccountNestedInput, { nullable: true })
  public facebookAccount?: FacebookAccountNestedInput | null;

  // <keep-methods>
  // </keep-methods>
}
