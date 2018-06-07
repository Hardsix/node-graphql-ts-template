import { lowerFirst } from 'lodash';
import { SingleErModel } from './parse-er-model';

export function generateCrudResolver(model: SingleErModel) {
  const modelName = model.name;
  const resourceName = lowerFirst(modelName);
  const plural = `${resourceName}s`;

  return (
`import { Arg, Args, Mutation, Query, Info, ID } from 'type-graphql';
import { getRepository, getManager } from 'typeorm';

import { ${modelName} } from '../models/${modelName}';
import { ${modelName}CreateInput } from '../inputs/${modelName}CreateInput';
import { getFindOptions } from '../../utils/get-find-options';

export class ${modelName}CrudResolver {
  @Query((returns) => ${modelName})
  async ${resourceName}(@Arg('id', () => ID) id: number, @Info() info) {
    return await getRepository(${modelName}).findOne(id, getFindOptions(${modelName}, info));
  }

  @Query((returns) => [${modelName}])
  ${plural}(@Info() info) {
    return getRepository(${modelName}).find(getFindOptions(${modelName}, info));
  }

  @Mutation((returns) => ${modelName})
  async create${modelName}(@Args() input: ${modelName}CreateInput): Promise<${modelName}> {
    const em = getManager();
    const model = new ${modelName}();
    await model.update(input, { em: getManager() });

    return await em.save(${modelName}, model);
  }

  @Mutation((returns) => ${modelName})
  async update${modelName}(@Arg('id', () => ID) id: number, @Args() input: ${modelName}CreateInput) {
    const em = getManager();
    const model = await em.findOneOrFail(${modelName}, id);
    await model.update(input, { em: getManager() });

    return em.save(${modelName}, model);
  }

  @Mutation((returns) => Boolean)
  async delete${modelName}(@Arg('id', () => ID) id: number): Promise<boolean> {
    await getRepository(${modelName}).delete(id);

    return true;
  }
}
`);
}
