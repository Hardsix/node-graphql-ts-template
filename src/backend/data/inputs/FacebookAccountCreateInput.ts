import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class FacebookAccountCreateInput {
  @Field(() => String)
  public facebookUserId: string;

  @Field(() => String)
  public facebookAccessToken: string;

  @Field(() => ID)
  public userId: EntityId;

  // <keep-methods>
  // </keep-methods>
}
