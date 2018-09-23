import { IRequestContext } from '../../data/IRequestContext';

export interface IAuthorizationChecker {
  canRead(ctx: IRequestContext, field?: string): Promise<boolean>;
  canCreate(ctx: IRequestContext): Promise<boolean>;
  canUpdate(ctx: IRequestContext): Promise<boolean>;
  canDelete(ctx: IRequestContext): Promise<boolean>;
}
