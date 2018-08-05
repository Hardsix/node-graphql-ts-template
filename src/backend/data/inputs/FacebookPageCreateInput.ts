import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class FacebookPageCreateInput {
  @Field(() => String)
  public pageAccessToken: string;

  @Field(() => Number)
  public pageId: number;

  @Field(() => String, { nullable: true })
  public name?: string | null;

  @Field(() => ID)
  public ownerId: EntityId;

  // <keep-methods>
  // </keep-methods>
}
