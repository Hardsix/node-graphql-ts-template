import * as fs from 'fs';
import * as path from 'path';
import { generateBase } from './generate-base';
import { generateSingleModel } from './generate-er-model';
import { generateInput } from './generate-input';
import { generateResolver } from './generate-resolver';
import { parseErModel } from './parse-er-model';

const modelData = fs.readFileSync(path.join(__dirname, '..', 'model.er'), 'utf8');
const models = parseErModel(modelData);

function cleanUp(data: string) {
  return data.replace(/\n\n+/g, '\n\n');
}

function writeToFile(data: string, dir: string, name: string) {
  fs.writeFileSync(path.join(__dirname, '..', dir, name), cleanUp(data), {
    encoding: 'utf8',
  });
}

for (const model of models) {
  const base = generateBase(model);
  const input = generateInput(model);
  const dbModel = generateSingleModel(model);
  const resolver = generateResolver(model);
  const name = model.name;

  writeToFile(base, 'base', `${name}Base.ts`);
  writeToFile(input, 'inputs', `${name}CreateInput.ts`);
  writeToFile(dbModel, 'models', `${name}.ts`);
  writeToFile(resolver, 'resolvers', `${name}Resolver.ts`);
}
