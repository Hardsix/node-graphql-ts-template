// tslint:disable max-line-length no-duplicate-imports
import { assign } from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import * as auth from '../../utils/auth/auth-checkers';
import { IAuthorizable } from '../../utils/auth/IAuthorizable';
import { fakePromise } from '../utils/fake-promise';
import { fixId } from '../utils/fix-id';
import { UserAuth } from './UserAuth';
import { EntityId } from '../EntityId';
import { UserRole } from './enums/UserRole';
import { UserCreateInput } from './inputs/UserCreateInput';
import { UserEditInput } from './inputs/UserEditInput';
import { UserNestedInput } from './inputs/UserNestedInput';
import { IRequestContext } from '../IRequestContext';
import { File } from './File';
import { Post } from './Post';

// <keep-imports>
import { hashPassword, verifyPassword } from '../utils/crypto';
// </keep-imports>

// <keep-decorators>
// </keep-decorators>
@Entity()
@ObjectType()
export class User implements IAuthorizable {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: EntityId;

  public authorizationChecker = new UserAuth(this);

  @Field(() => String, { nullable: true })
  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public email?: string | null;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public passwordHash?: string | null;

  @Field(() => String)
  @Column({
    // <custom-column-args>
    // </custom-column-args>
  })
  public firstName: string;

  @Field(() => String)
  @Column({
    // <custom-column-args>
    // </custom-column-args>
  })
  public lastName: string;

  @Field(() => String, { nullable: true })
  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public fullName?: string | null;

  @Column({enum: UserRole,
    // <custom-column-args>
    // </custom-column-args>
  })
  public role: UserRole;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public accountVerificationCode?: string | null;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public forgotPasswordCode?: string | null;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public googleUserId?: string | null;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public googleToken?: string | null;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public facebookUserId?: string | null;

  @Column({nullable: true, type: 'varchar',
    // <custom-column-args>
    // </custom-column-args>
  })
  public facebookAccessToken?: string | null;

  @OneToMany((type) => Post, (post) => post.author)
  @Field((returns) => [Post])
  public posts: Promise<Array<Post>>;

  @OneToOne((type) => File, (file) => file.user)
  @Field((returns) => File , { nullable: true })
  public profileImage: Promise<File | undefined | null>;

  public async update(input: UserCreateInput | UserEditInput | UserNestedInput, context: IRequestContext) {
    fixId(input);
    const { profileImage, ...data } = input;
    if (this.id && 'id' in input && Object.keys(input).length > 1) {
      await auth.assertCanUpdate(this, context);
    }
    assign(this, data);

    if (profileImage === null) {
      this.profileImage = Promise.resolve(null);
    } else if (profileImage === undefined) {
      // do nothing
    } else if (profileImage.id) {
      const profileImageModel = await context.em.findOneOrFail(File, profileImage.id);
      this.profileImage = fakePromise(await profileImageModel.update(profileImage, context));
    } else {
      this.profileImage = fakePromise(await new File().update(profileImage, context));
    }

    context.modelsToSave = [...(context.modelsToSave || []), this];

    // <keep-update-code>
    const { password } = input;
    this.passwordHash = password && await hashPassword(password);

    if (this.role === undefined) {
      this.role = UserRole.USER;
    }
    // </keep-update-code>
    if (!('id' in input)) {
      await auth.assertCanCreate(this, context);
    }

    return this;
  }

  // <keep-methods>
  public async passwordMatches(password: string) {
    return verifyPassword(password, this.passwordHash);
  }
  // </keep-methods>
}
