import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';

export interface IRequestContext {
  em: EntityManager;
  request?: Request;
  response?: Response;
  modelsToSave?: Array<object>;
}
