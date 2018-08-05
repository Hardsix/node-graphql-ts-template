// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { PostEditInput } from '../inputs/PostEditInput';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
// </keep-imports>

@Entity()
@ObjectType()
export class Post {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @Field(() => String)
  @Column()
  public content: string;

  @ManyToOne((type) => User, (user) => user.posts , { nullable: true, onDelete: 'SET NULL' })
  @Field((returns) => User , { nullable: true })
  public author: Promise<User | undefined | null>;

  public async update(input: PostCreateInput | PostEditInput, context: IRequestContext) {
    const { authorId, ...data } = input;
    assign(this, data);

    if (authorId !== undefined) {
      this.author = Promise.resolve(authorId === null ? null : await context.em.findOneOrFail(User, authorId));
    }

    // <keep-update-code>
    // </keep-update-code>
  }

  // <keep-methods>
  // </keep-methods>
}
