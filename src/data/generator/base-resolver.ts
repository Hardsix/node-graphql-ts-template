import * as fs from 'fs';
import { lowerFirst } from 'lodash';
import * as path from 'path';

const getResolverString = (Model, resourceName, plural) => `
import { Arg, Args, Mutation, Query, Info, ID } from 'type-graphql';
import { getRepository, getManager } from 'typeorm';

import { ${Model} } from '../models/${Model}';
import { ${Model}CreateInput } from '../inputs/${Model}CreateInput';
import { getFindOptions } from '../../utils/get-find-options';

export class ${Model}BaseResolver {
  @Query((returns) => ${Model})
  async ${resourceName}(@Arg('id', id => ID) id: number, @Info() info) {
    return await getRepository(${Model}).findOne(id, getFindOptions(${Model}, info));
  }

  @Query((returns) => [${Model}])
  ${plural}(@Info() info) {
    return getRepository(${Model}).find(getFindOptions(${Model}, info));
  }

  @Mutation((returns) => ${Model})
  async create${Model}(@Args() input: ${Model}CreateInput): Promise<${Model}> {
    const em = getManager();
    const model = new ${Model}();
    await model.update(input, em);
    return await em.save(${Model}, model);
  }

  @Mutation((returns) => ${Model})
  async update${Model}(@Arg('id', () => ID) id: number, @Args() input: ${Model}CreateInput) {
    const em = getManager();
    const model = await em.findOneOrFail(${Model}, id);
    await model.update(input, em);
    return em.save(${Model}, model);
  }

  @Mutation((returns) => Boolean)
  async delete${Model}(@Arg('id', () => ID) id: number): Promise<boolean> {
    await getRepository(${Model}).delete(id);
    return true;
  }
}
`;

export function BaseResolver(Model, resourceName = lowerFirst(Model), plural = `${resourceName}s`)
  : new () => object {
  const className = `${Model}BaseResolver`;
  const tmpFilePath = path.join(__dirname, `${className}.ts`);

  fs.writeFileSync(tmpFilePath, getResolverString(Model, resourceName, plural), {
    encoding: 'utf8',
  });
  // tslint:disable-next-line non-literal-require
  const resolverClass = require(`./${className}`)[className];
  fs.unlinkSync(tmpFilePath);

  return resolverClass;
}
