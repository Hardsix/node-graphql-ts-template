// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

import { fixId } from '../../utils/fix-id';
import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { PostEditInput } from '../inputs/PostEditInput';
import { PostNestedInput } from '../inputs/PostNestedInput';
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

  @ManyToOne((type) => User, (user) => user.posts , { nullable: false, onDelete: 'CASCADE' })
  @Field((returns) => User , { nullable: false })
  public author: Promise<User>;

  public async update(input: PostCreateInput | PostEditInput | PostNestedInput, context: IRequestContext) {
    fixId(input);
    const { author, ...data } = input;
    assign(this, data);

    if (author === null) {
      throw new Error('Post.author cannot be null');
    } else if (author === undefined) {
      // do nothing
    } else if (author.id) {
      this.author = Promise.resolve((await context.em.findOneOrFail(User, author.id)).update(author, context));
    } else {
      this.author = Promise.resolve(new User().update(author, context));
    }

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    // </keep-update-code>

    return this;
  }

  // <keep-methods>
  // </keep-methods>
}
