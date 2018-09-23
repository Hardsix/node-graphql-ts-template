// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { File } from './File';
import { User } from './User';

import * as auth from '../../utils/auth/auth-checkers';
import { IAuthorizable } from '../../utils/auth/IAuthorizable';
import { fakePromise } from '../../utils/fake-promise';
import { fixId } from '../../utils/fix-id';
import { PostAuth } from '../auth/PostAuth';
import { EntityId } from '../EntityId';
import { PostCreateInput } from '../inputs/PostCreateInput';
import { PostEditInput } from '../inputs/PostEditInput';
import { PostNestedInput } from '../inputs/PostNestedInput';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
// </keep-imports>

// <keep-decorators>
// </keep-decorators>
@Entity()
@ObjectType()
export class Post implements IAuthorizable {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  public authorizationChecker = new PostAuth(this);

  @Field(() => String)
  @Column({
    // <custom-column-args>
    // </custom-column-args>
  })
  public content: string;

  @Field(() => String)
  @Column({
    // <custom-column-args>
    // </custom-column-args>
  })
  public title: string;

  @ManyToOne((type) => User, (user) => user.posts , { nullable: false, onDelete: 'CASCADE' })
  @Field((returns) => User , { nullable: false })
  public author: Promise<User>;

  @OneToMany((type) => File, (file) => file.post)
  @Field((returns) => [File])
  public images: Promise<Array<File>>;

  public async update(input: PostCreateInput | PostEditInput | PostNestedInput, context: IRequestContext) {
    fixId(input);
    const { author, ...data } = input;
    if (this.id && 'id' in input && Object.keys(input).length > 1) {
      await auth.assertCanUpdate(this, context);
    }
    assign(this, data);

    if (author === null) {
      throw new Error('Post.author cannot be null');
    } else if (author === undefined) {
      // do nothing
    } else if (author.id) {
      const authorModel = await context.em.findOneOrFail(User, author.id);
      this.author = fakePromise(await authorModel.update(author, context));
    } else {
      this.author = fakePromise(await new User().update(author, context));
    }

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    // </keep-update-code>
    if (!('id' in input)) {
      await auth.assertCanCreate(this, context);
    }

    return this;
  }

  // <keep-methods>
  // </keep-methods>
}
