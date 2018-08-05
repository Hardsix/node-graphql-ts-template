import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class FacebookAccountEditInput {
  @Field(() => String, { nullable: true })
  public facebookUserId?: string | null;

  @Field(() => String, { nullable: true })
  public facebookAccessToken?: string | null;

  @Field(() => ID, { nullable: true })
  public userId?: EntityId | null;

  // <keep-methods>
  // </keep-methods>
}
