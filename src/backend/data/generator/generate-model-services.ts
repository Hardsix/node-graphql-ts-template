import { ISingleErModel } from './model-types';

export function generateModelServices(model: ISingleErModel) {
  const { name } = model;

  return (
`import { ${name}CreateInput } from '../inputs/${name}CreateInput';
import { IRequestContext } from '../IRequestContext';
import { ${name} } from '../models/${name}';

export function update${name}Model(
  model: ${name},
  input: ${name}CreateInput,
  context: IRequestContext) {
  return undefined;
}
`);
}
