import { SingleErModel } from './parse-er-model';

export function generateModelServices(model: SingleErModel) {
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
