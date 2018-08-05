// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

import { EntityId } from '../EntityId';
import { FacebookPageCreateInput } from '../inputs/FacebookPageCreateInput';
import { FacebookPageEditInput } from '../inputs/FacebookPageEditInput';
import { IRequestContext } from '../IRequestContext';

// <keep-imports>
// </keep-imports>

@Entity()
@ObjectType()
export class FacebookPage {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @Field(() => String)
  @Column()
  public pageAccessToken: string;

  @Field(() => Number)
  @Column({ type: 'bigint' })
  public pageId: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  public name?: string | null;

  @ManyToOne((type) => User, (user) => user.facebookPages , { nullable: false, onDelete: 'CASCADE' })
  @Field((returns) => User , { nullable: false })
  public owner: Promise<User>;

  public async update(input: FacebookPageCreateInput | FacebookPageEditInput, context: IRequestContext) {
    const { ownerId, ...data } = input;
    assign(this, data);

    if (ownerId) {
      this.owner = Promise.resolve(await context.em.findOneOrFail(User, ownerId));
    }

    // <keep-update-code>
    // </keep-update-code>
  }

  // <keep-methods>
  // </keep-methods>
}
