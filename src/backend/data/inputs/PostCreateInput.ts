import { ArgsType, Field, ID } from 'type-graphql';

import { EntityId } from '../EntityId';

// <keep-imports>
// </keep-imports>

@ArgsType()
export class PostCreateInput {
  @Field(() => String)
  public content: string;

  @Field(() => ID, { nullable: true })
  public authorId?: EntityId | null;

  // <keep-methods>
  // </keep-methods>
}
