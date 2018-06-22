import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ArgsType()
@ObjectType()
export class FacebookPageBase {
  @Column()
  @Field(() => String)
  public pageAccessToken: string;

  @Column({type: 'bigint'})
  @Field(() => Number)
  public pageId: number;

  @Column({nullable: true, type: 'varchar'})
  @Field(() => String, {nullable: true})
  public name?: string | null;
}
