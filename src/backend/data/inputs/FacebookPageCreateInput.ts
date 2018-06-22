import { ArgsType, Field, ID } from 'type-graphql';

import { FacebookPageBase } from '../base/FacebookPageBase';
import { EntityId } from '../EntityId';

@ArgsType()
export class FacebookPageCreateInput extends FacebookPageBase {
  @Field(() => ID)
  public ownerId: EntityId;
}
