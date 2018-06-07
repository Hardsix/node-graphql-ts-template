import { SingleErModel } from './parse-er-model';

export function generateResolver(model: SingleErModel) {
  return (
`import { Resolver } from 'type-graphql';

import { ${model.name} } from '../models/${model.name}';

@Resolver(${model.name})
export class ${model.name}Resolver {
}
`);
}
