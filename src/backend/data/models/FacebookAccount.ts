// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

import { EntityId } from '../EntityId';
import { FacebookAccountCreateInput } from '../inputs/FacebookAccountCreateInput';
import { FacebookAccountEditInput } from '../inputs/FacebookAccountEditInput';
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
  public facebookUserId: string;

  @Field(() => String)
  @Column()
  public facebookAccessToken: string;

  @OneToOne((type) => User, (user) => user.facebookAccount , { nullable: false, onDelete: 'CASCADE' })
  @Field((returns) => User , { nullable: false })
  @JoinColumn()
  public user: Promise<User>;

  public async update(input: FacebookAccountCreateInput | FacebookAccountEditInput, context: IRequestContext) {
    const { userId, ...data } = input;
    assign(this, data);

    if (userId) {
      this.user = Promise.resolve(await context.em.findOneOrFail(User, userId));
    }

    // <keep-update-code>
    // </keep-update-code>
  }

  // <keep-methods>
  // </keep-methods>
}
