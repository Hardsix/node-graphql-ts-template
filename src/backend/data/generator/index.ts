import * as fs from 'fs';
import * as makeDir from 'make-dir';
import * as path from 'path';

import { findBetween, replaceBetween } from '../../utils/find-between';
import { generateCrudResolver } from './generate-crud-resolver';
import { generateEnum } from './generate-enum';
import { generateSingleModel } from './generate-er-model';
import { generateInput } from './generate-input';
import { generateResolver } from './generate-resolver';
import { getEnumName, isEnum } from './model-types';
import { parseErModel } from './parse-er-model';

const modelData = fs.readFileSync(path.join(__dirname, '..', 'model.er'), 'utf8');
const models = parseErModel(modelData);

function insertOldContent(newContent, oldContent, start, end) {
  const contentToKeep = findBetween(oldContent, start, end);
  if (!contentToKeep) {
    return newContent;
  }

  return replaceBetween(newContent, start, end, contentToKeep);
}

function cleanUp(data: string) {
  return data
    .replace(/\n\n+/g, '\n\n')
    .replace(/{\n\n/g, '{\n')
    .replace(/\n\n}/g, '\n}');
}

const keepingTags = [{
  start: '// <keep-methods>',
  end: '// </keep-methods>',
}, {
  start: '// <keep-imports>',
  end: '// </keep-imports>',
}, {
  start: '// <keep-update-code>',
  end: '// </keep-update-code>',
}];

async function writeToFile(data: string, dir: string, name: string, overwrite: boolean) {
  const dirName = path.join(__dirname, '..', dir);
  await makeDir(dirName);

  const filePath = path.join(dirName, name);

  if (!overwrite && fs.existsSync(filePath)) {
    // tslint:disable-next-line no-console
    console.log(`skipping ${name} because it already exists`);

    return;
  }

  let newContent;
  try {
    const oldContent = fs.readFileSync(filePath, 'utf8');
    newContent = cleanUp(data);
    for (const { start, end } of keepingTags) {
      newContent = insertOldContent(newContent, oldContent, start, end);
    }
  } catch (e) {
    newContent = cleanUp(data);
  }

  fs.writeFileSync(filePath, newContent, {
    encoding: 'utf8',
  });
}

(async () => {
  for (const model of models) {
    const createInput = generateInput(model, 'create');
    const editInput = generateInput(model, 'edit');
    const nestedInput = generateInput(model, 'nested');
    const dbModel = generateSingleModel(model);
    const resolver = generateResolver(model);
    const crudResolver = generateCrudResolver(model);
    const { name } = model;

    await writeToFile(createInput, 'inputs', `${name}CreateInput.ts`, true);
    await writeToFile(editInput, 'inputs', `${name}EditInput.ts`, true);
    await writeToFile(nestedInput, 'inputs', `${name}NestedInput.ts`, true);
    await writeToFile(dbModel, 'models', `${name}.ts`, true);
    await writeToFile(resolver, 'type-resolvers', `${name}Resolver.ts`, false);
    await writeToFile(crudResolver, 'resolvers', `${name}CrudResolver.ts`, true);

    model.fields.filter(isEnum).forEach(async (field) => {
      const enumName = getEnumName(field);
      await writeToFile(generateEnum(model, field), 'enums', `${enumName}.ts`, true);
    });
  }
})();
