import { ArgsType, Field, ID } from 'type-graphql';

import { UserBase } from '../base/UserBase';
import { EntityId } from '../EntityId';

@ArgsType()
export class UserCreateInput extends UserBase {
  @Field(() => String)
  public password: string;
}
