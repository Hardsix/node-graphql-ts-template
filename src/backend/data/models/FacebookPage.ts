// tslint:disable max-line-length
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { FacebookPageBase } from '../base/FacebookPageBase';
import { EntityId } from '../EntityId';
import { FacebookPageCreateInput } from '../inputs/FacebookPageCreateInput';
import { IRequestContext } from '../IRequestContext';
import { updateFacebookPageModel } from '../services/facebook-page-services';
import { User } from './User';

@Entity()
@ObjectType()
export class FacebookPage extends FacebookPageBase {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  @ManyToOne((type) => User, (user) => user.facebookPages , {nullable: false, onDelete: 'CASCADE'})
  @Field((returns) => User , {nullable: false})
  public owner: Promise<User>;

  public async update(input: FacebookPageCreateInput, context: IRequestContext) {
    const { ownerId, ...data } = input;
    assign(this, data);

    this.owner = Promise.resolve(await context.em.findOneOrFail(User, ownerId));
    await updateFacebookPageModel(this, input, context);
  }
}
