import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class FacebookPageEditInput {
  @Field(() => String, { nullable: true })
  public pageAccessToken?: string | null;

  @Field(() => Number, { nullable: true })
  public pageId?: number | null;

  @Field(() => String, { nullable: true })
  public name?: string | null;

  @Field(() => ID, { nullable: true })
  public ownerId?: EntityId | null;

  // <keep-methods>
  // </keep-methods>
}
