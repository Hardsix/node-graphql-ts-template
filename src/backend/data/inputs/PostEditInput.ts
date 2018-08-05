import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class PostEditInput {
  @Field(() => String, { nullable: true })
  public content?: string | null;

  @Field(() => ID, { nullable: true })
  public authorId?: EntityId | null;

  // <keep-methods>
  // </keep-methods>
}
