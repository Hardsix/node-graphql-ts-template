// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityId } from '../EntityId';
import { UserType } from '../enums/UserType';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { UserEditInput } from '../inputs/UserEditInput';
import { IRequestContext } from '../IRequestContext';
import { FacebookAccount } from './FacebookAccount';
import { FacebookPage } from './FacebookPage';
import { Post } from './Post';

// <keep-imports>
// </keep-imports>

@Entity()
@ObjectType()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @Column()
  public passwordHash: string;

  @Field(() => String)
  @Column()
  public email: string;

  @Field(() => UserType)
  @Column({ enum: UserType })
  public type: UserType;

  @OneToMany((type) => FacebookPage, (facebookPage) => facebookPage.owner)
  @Field((returns) => [FacebookPage])
  public facebookPages: Promise<Array<FacebookPage>>;

  @OneToMany((type) => Post, (post) => post.author)
  @Field((returns) => [Post])
  public posts: Promise<Array<Post>>;

  @OneToOne((type) => FacebookAccount, (facebookAccount) => facebookAccount.user)
  @Field((returns) => FacebookAccount , { nullable: true })
  public facebookAccount: Promise<FacebookAccount | undefined | null>;

  public async update(input: UserCreateInput | UserEditInput, context: IRequestContext) {
    const { facebookAccountId, ...data } = input;
    assign(this, data);

    if (facebookAccountId) {
      this.facebookAccount = Promise.resolve(await context.em.findOneOrFail(FacebookAccount, facebookAccountId));
    }

    // <keep-update-code>
    this.passwordHash = `hash(${input.password})`;
    // </keep-update-code>
  }

  // <keep-methods>
  // </keep-methods>
}
