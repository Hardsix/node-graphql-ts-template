import { UserRole } from '../user/enums/UserRole';

export interface ITokenUser {
  id: number;
  email?: number;
  role: UserRole;
}

export interface IToken {
  user: ITokenUser;
}
