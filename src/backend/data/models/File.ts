// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';
import { User } from '../../modules/user/model/User';

import * as auth from '../../utils/auth/auth-checkers';
import { IAuthorizable } from '../../utils/auth/IAuthorizable';
import { fakePromise } from '../../utils/fake-promise';
import { fixId } from '../../utils/fix-id';
import { FileAuth } from '../auth/FileAuth';
import { EntityId } from '../EntityId';
import { FileCreateInput } from '../inputs/FileCreateInput';
import { FileEditInput } from '../inputs/FileEditInput';
import { FileNestedInput } from '../inputs/FileNestedInput';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
import * as crypto from 'crypto';
// </keep-imports>

// <keep-decorators>
// </keep-decorators>
@Entity()
@ObjectType()
export class File implements IAuthorizable {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  public authorizationChecker = new FileAuth(this);

  @Field(() => String)
  @Column({type: 'text',
    // <custom-column-args>
    select: false,
    // </custom-column-args>
  })
  public contentBase64: string;

  @Column({
    // <custom-column-args>
    // </custom-column-args>
  })
  public slug: string;

  @ManyToOne((type) => Post, (post) => post.images , { nullable: true, onDelete: 'SET NULL' })
  @Field((returns) => Post , { nullable: true })
  public post: Promise<Post | undefined | null>;

  @OneToOne((type) => User, (user) => user.profileImage , { nullable: true, onDelete: 'SET NULL' })
  @Field((returns) => User , { nullable: true })
  @JoinColumn()
  public user: Promise<User | undefined | null>;

  public async update(input: FileCreateInput | FileEditInput | FileNestedInput, context: IRequestContext) {
    fixId(input);
    const { post, user, ...data } = input;
    if (this.id && 'id' in input && Object.keys(input).length > 1) {
      await auth.assertCanUpdate(this, context);
    }
    assign(this, data);

    if (post === null) {
      this.post = Promise.resolve(null);
    } else if (post === undefined) {
      // do nothing
    } else if (post.id) {
      const postModel = await context.em.findOneOrFail(Post, post.id);
      this.post = fakePromise(await postModel.update(post, context));
    } else {
      this.post = fakePromise(await new Post().update(post, context));
    }

    if (user === null) {
      this.user = Promise.resolve(null);
    } else if (user === undefined) {
      // do nothing
    } else if (user.id) {
      const userModel = await context.em.findOneOrFail(User, user.id);
      this.user = fakePromise(await userModel.update(user, context));
    } else {
      this.user = fakePromise(await new User().update(user, context));
    }

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    if (this.slug === undefined) {
      this.slug = crypto.randomBytes(16).toString('hex');
    }
    // </keep-update-code>
    if (!('id' in input)) {
      await auth.assertCanCreate(this, context);
    }

    return this;
  }

  // <keep-methods>
  public async getOwner() {
    const owner = await this.user;
    if (owner) {
      return owner;
    }

    const post = await this.post;

    return post && post.author;
  }
  // </keep-methods>
}
