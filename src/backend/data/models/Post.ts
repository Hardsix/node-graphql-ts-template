// tslint:disable max-line-length
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PostBase } from '../base/PostBase';
import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { IRequestContext } from '../IRequestContext';
import { updatePostModel } from '../services/post-services';
import { User } from './User';

@Entity()
@ObjectType()
export class Post extends PostBase {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @ManyToOne((type) => User, (user) => user.posts , {nullable: true, onDelete: 'SET NULL'})
  @Field((returns) => User , {nullable: true})
  public author: Promise<User | undefined | null>;

  public async update(input: PostCreateInput, context: IRequestContext) {
    const { authorId, ...data } = input;
    assign(this, data);

    if (authorId !== undefined) {
      this.author = Promise.resolve(authorId ? await context.em.findOneOrFail(User, authorId) : null);
    }

    await updatePostModel(this, input, context);
  }
}
