// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { EntityId } from '../EntityId';
import { UserType } from '../enums/UserType';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { UserEditInput } from '../inputs/UserEditInput';
import { IRequestContext } from '../IRequestContext';
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

  public async update(input: UserCreateInput | UserEditInput, context: IRequestContext) {
    const data = input;
    assign(this, data);

    // <keep-update-code>
    // </keep-update-code>
  }

  // <keep-methods>
  // </keep-methods>
}
