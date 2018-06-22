import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ArgsType()
@ObjectType()
export class PostBase {
  @Column()
  @Field(() => String)
  public content: string;
}
