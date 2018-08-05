import * as fs from 'fs';
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

function writeToFile(data: string, dir: string, name: string, overwrite: boolean) {
  const filePath = path.join(__dirname, '..', dir, name);

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

for (const model of models) {
  const createInput = generateInput(model, 'create');
  const editInput = generateInput(model, 'edit');
  const dbModel = generateSingleModel(model);
  const resolver = generateResolver(model);
  const crudResolver = generateCrudResolver(model);
  const { name } = model;

  writeToFile(createInput, 'inputs', `${name}CreateInput.ts`, true);
  writeToFile(editInput, 'inputs', `${name}EditInput.ts`, true);
  writeToFile(dbModel, 'models', `${name}.ts`, true);
  writeToFile(resolver, 'type-resolvers', `${name}Resolver.ts`, false);
  writeToFile(crudResolver, 'resolvers', `${name}CrudResolver.ts`, true);

  model.fields.filter(isEnum).forEach((field) => {
    const enumName = getEnumName(field);
    writeToFile(generateEnum(model, field), 'enums', `${enumName}.ts`, true);
  });
}
