import { ArgsType, Field, ID } from 'type-graphql';

import { PostBase } from '../base/PostBase';
import { EntityId } from '../EntityId';

@ArgsType()
export class PostCreateInput extends PostBase {
  @Field(() => ID, {nullable: true})
  public authorId?: EntityId | null;
}
