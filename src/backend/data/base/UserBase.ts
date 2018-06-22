import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';

@ArgsType()
@ObjectType()
export class UserBase {
  @Column()
  @Field(() => String)
  public email: string;

  @Column()
  @Field(() => String)
  public facebookUserId: string;

  @Column()
  @Field(() => String)
  public userAccessToken: string;
}
