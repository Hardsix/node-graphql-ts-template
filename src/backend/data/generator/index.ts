import * as fs from 'fs';
import { kebabCase } from 'lodash';
import * as path from 'path';

import { generateBase } from './generate-base';
import { generateCrudResolver } from './generate-crud-resolver';
import { generateSingleModel } from './generate-er-model';
import { generateInput } from './generate-input';
import { generateModelServices } from './generate-model-services';
import { generateResolver } from './generate-resolver';
import { parseErModel } from './parse-er-model';

const modelData = fs.readFileSync(path.join(__dirname, '..', 'model.er'), 'utf8');
const models = parseErModel(modelData);

function cleanUp(data: string) {
  return data
    .replace(/\n\n+/g, '\n\n')
    .replace(/{\n\n/g, '{\n')
    .replace(/\n\n}/g, '\n}');
}

function writeToFile(data: string, dir: string, name: string, overwrite: boolean) {
  const filePath = path.join(__dirname, '..', dir, name);

  if (!overwrite && fs.existsSync(filePath)) {
    // tslint:disable-next-line no-console
    console.log(`skipping ${name} because it already exists`);

    return;
  }

  fs.writeFileSync(filePath, cleanUp(data), {
    encoding: 'utf8',
  });
}

for (const model of models) {
  const base = generateBase(model);
  const input = generateInput(model);
  const dbModel = generateSingleModel(model);
  const resolver = generateResolver(model);
  const crudResolver = generateCrudResolver(model);
  const modelServices = generateModelServices(model);
  const { name } = model;

  writeToFile(base, 'base', `${name}Base.ts`, true);
  writeToFile(input, 'inputs', `${name}CreateInput.ts`, true);
  writeToFile(dbModel, 'models', `${name}.ts`, true);
  writeToFile(resolver, 'type-resolvers', `${name}Resolver.ts`, false);
  writeToFile(crudResolver, 'resolvers', `${name}CrudResolver.ts`, true);
  writeToFile(modelServices, 'services', `${kebabCase(name)}-services.ts`, false);
}
