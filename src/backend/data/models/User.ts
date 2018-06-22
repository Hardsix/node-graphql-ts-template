// tslint:disable max-line-length
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserBase } from '../base/UserBase';
import { EntityId } from '../EntityId';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { IRequestContext } from '../IRequestContext';
import { updateUserModel } from '../services/user-services';
import { FacebookPage } from './FacebookPage';
import { Post } from './Post';

@Entity()
@ObjectType()
export class User extends UserBase {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @Column()
  @Field(() => String)
  public passwordHash: string;

  @OneToMany((type) => FacebookPage, (facebookPage) => facebookPage.owner)
  @Field((returns) => [FacebookPage])
  public facebookPages: Promise<Array<FacebookPage>>;

  @OneToMany((type) => Post, (post) => post.author)
  @Field((returns) => [Post])
  public posts: Promise<Array<Post>>;

  public async update(input: UserCreateInput, context: IRequestContext) {
    const data = input;
    assign(this, data);

    await updateUserModel(this, input, context);
  }
}
