// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

import { fixId } from '../../utils/fix-id';
import { EntityId } from '../EntityId';
import { FacebookAccountCreateInput } from '../inputs/FacebookAccountCreateInput';
import { FacebookAccountEditInput } from '../inputs/FacebookAccountEditInput';
import { FacebookAccountNestedInput } from '../inputs/FacebookAccountNestedInput';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
// </keep-imports>

@Entity()
@ObjectType()
export class FacebookAccount {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @Field(() => String)
  @Column()
  public externalUserId: string;

  @OneToOne((type) => User, (user) => user.facebookAccount , { nullable: false, onDelete: 'CASCADE' })
  @Field((returns) => User , { nullable: false })
  @JoinColumn()
  public user: Promise<User>;

  public async update(input: FacebookAccountCreateInput | FacebookAccountEditInput | FacebookAccountNestedInput, context: IRequestContext) {
    fixId(input);
    const { user, ...data } = input;
    assign(this, data);

    if (user === null) {
      throw new Error('FacebookAccount.user cannot be null');
    } else if (user === undefined) {
      // do nothing
    } else if (user.id) {
      this.user = Promise.resolve((await context.em.findOneOrFail(User, user.id)).update(user, context));
    } else {
      this.user = Promise.resolve(new User().update(user, context));
    }

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    // </keep-update-code>

    return this;
  }

  // <keep-methods>
  // </keep-methods>
}
