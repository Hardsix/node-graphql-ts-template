// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';

import { fixId } from '../../utils/fix-id';
import { EntityId } from '../EntityId';
import { UserCreateInput } from '../inputs/UserCreateInput';
import { UserEditInput } from '../inputs/UserEditInput';
import { UserNestedInput } from '../inputs/UserNestedInput';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
// </keep-imports>

@Entity()
@ObjectType()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @Field(() => String)
  @Column()
  public email: string;

  @OneToMany((type) => Post, (post) => post.author)
  @Field((returns) => [Post])
  public posts: Promise<Array<Post>>;

  public async update(input: UserCreateInput | UserEditInput | UserNestedInput, context: IRequestContext) {
    fixId(input);
    const data = input;
    assign(this, data);

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    // </keep-update-code>

    return this;
  }

  // <keep-methods>
  // </keep-methods>
}
