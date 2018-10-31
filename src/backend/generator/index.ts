import * as bluebird from 'bluebird';
import * as fs from 'fs';
import { kebabCase } from 'lodash';
import * as makeDir from 'make-dir';
import * as path from 'path';

import { findBetween, replaceBetween } from '../utils/find-between';
import { generateAuthChecker } from './generate-auth-checker';
import { generateCrudResolver } from './generate-crud-resolver';
import { generateEnum } from './generate-enum';
import { generateSingleModel } from './generate-er-model';
import { generateFieldResolver } from './generate-field-resolver';
import { generateInput } from './generate-input';
import { IGeneratorContext } from './generator-context';
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
}, {
  start: '// <keep-decorators>',
  end: '// </keep-decorators>',
}];

async function writeToFile(data: string, dir: string, name: string, overwrite: boolean) {
  const dirName = path.join(__dirname, '..', dir);
  await makeDir(dirName);

  const filePath = path.join(dirName, name);

  if (!overwrite && fs.existsSync(filePath)) {
    // tslint:disable-next-line no-console
    console.info(`skipping ${name} because it already exists`);

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

function fileToGeneratorContext(dir: string, name: string): IGeneratorContext {
  const dirName = path.join(__dirname, '..', dir);
  const filePath = path.join(dirName, name);
  let existingContent;
  try {
    existingContent = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    existingContent = '';
  }

  return { existingContent };
}

(async () => {
  for (const model of models) {
    const { name } = model;
    const moduleName = kebabCase(name);

    const createInput = generateInput(model, 'create');
    const editInput = generateInput(model, 'edit');
    const nestedInput = generateInput(model, 'nested');
    const dbModel = generateSingleModel(model, fileToGeneratorContext('models', `${name}.ts`));
    const resolver = generateFieldResolver(model);
    const crudResolver = generateCrudResolver(model);
    const authChecker = generateAuthChecker(model);

    await writeToFile(createInput, `${moduleName}/inputs`, `${name}CreateInput.ts`, true);
    await writeToFile(editInput, `${moduleName}/inputs`, `${name}EditInput.ts`, true);
    await writeToFile(nestedInput, `${moduleName}/inputs`, `${name}NestedInput.ts`, true);
    await writeToFile(dbModel, `${moduleName}/model`, `${name}.ts`, true);
    await writeToFile(resolver, `${moduleName}/resolvers`, `${name}FieldResolvers.ts`, false);
    await writeToFile(crudResolver, `${moduleName}/resolvers`, `${name}CrudResolvers.ts`, true);

    await bluebird.each(model.fields.filter(isEnum), async (field) => {
      const enumName = getEnumName(field);
      await writeToFile(generateEnum(model, field), `${moduleName}/enums`, `${enumName}.ts`, true);
    });

    await writeToFile(authChecker, `${moduleName}/auth`, `${name}Auth.ts`, false);
  }
})();
