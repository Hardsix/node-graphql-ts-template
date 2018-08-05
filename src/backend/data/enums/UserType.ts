import { registerEnumType } from 'type-graphql';

export enum UserType {
  StandardUser = 'STANDARDUSER',
  SuperAdmin = 'SUPERADMIN',
  Admin = 'ADMIN',
}

registerEnumType(UserType, {
  name: 'UserType',
});
