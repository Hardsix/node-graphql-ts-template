import { UserCreateInput } from '../inputs/UserCreateInput';
import { IRequestContext } from '../IRequestContext';
import { User } from '../models/User';

export function updateUserModel(
  model: User,
  input: UserCreateInput,
  context: IRequestContext) {
  model.passwordHash = 'hashed-password';
}
