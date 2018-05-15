//tslint:disable
import { drop, flatten, includes } from 'lodash';

const trim = (x: string) => x.trim();
const remove = (str: string) => (x) => x.replace(str, '');

function getDefinitionName(definition: Array<string>) {
  return definition[0].replace(':', '');
}

function getDefinitionLines(definition: Array<string>) {
  return drop(definition, 1).map((d) => d.split(' ').map(remove(':')).map(trim));
}

export interface FieldDefinition {
  name: string;
  type: string;
  visibility: string;
  dbType: string | undefined;
}

function getFieldDefinition([visibility, name, type, dbType]: Array<string>): FieldDefinition {
  return { name, visibility, type: type || 'string', dbType };
}

interface ModelDefinition {
  name: string;
  fields: Array<FieldDefinition>;
}

function getModel(modelLines: Array<string>): ModelDefinition {
  const name = getDefinitionName(modelLines);
  const fields = getDefinitionLines(modelLines).map(getFieldDefinition);

  return { name, fields };
}

function getRelationParts(relation: string) {
  return relation.split('\n').map(trim).filter((x) => !!x);
}

function getPartComponents(relationPart: string) {
  return relationPart.split(/ has many | as | has one /g).map(trim).filter((x) => x);
}

function getPartType(relationPart: string) {
  if (includes(relationPart, 'has many')) {
    return 'many';
  }
  if (includes(relationPart, 'has one')) {
    return 'one';
  }
  throw new Error(`invalid relation part ${relationPart}`);
}

export interface RelationComponent {
  source: string;
  target: string;
  as: string;
  type: string;
}

function getRelationPart(relationPart: string): RelationComponent {
  const [ source, target, as ] = getPartComponents(relationPart);
  const type = getPartType(relationPart);

  return { source, target, as, type };
}

export interface RelationDefinition {
  first: RelationComponent;
  second: RelationComponent;
}

function getRelation(relation: string): RelationDefinition {
  const [first, second] = getRelationParts(relation).map(getRelationPart);
  return { first, second };
}

export interface ErModel {
  models: Array<ModelDefinition>;
  relations: Array<RelationDefinition>;
}

export interface SingleErRelation {
  otherTypeName: string;
  otherName: string;
  myTypeName: string;
  myName: string;
  relationType: string;
}

export interface SingleErModel {
  name: string;
  fields: Array<FieldDefinition>;
  relations: Array<SingleErRelation>;
}

function convertToSingleRelations(relationDefinition: RelationDefinition): Array<SingleErRelation> {
  const { first, second } = relationDefinition;

  const firstRelation: SingleErRelation = {
    myName: first.as,
    myTypeName: first.source,
    otherName: second.as,
    otherTypeName: first.target,
    relationType: first.type,
  };

  const secondRelation: SingleErRelation = {
    myName: second.as,
    myTypeName: second.source,
    otherName: first.as,
    otherTypeName: second.target,
    relationType: second.type,
  };

  return [firstRelation, secondRelation];
}

export function parseErModel(data: string) {
  const statements = data.split('\n\n').map(trim).filter((x) => x);
  const definitions = statements.filter((st) => includes(st, ':'));

  const modelLines = definitions.map((d) => d.split('\n').map(trim).filter((x) => x));
  const relationsLines = statements.filter((st) => !includes(st, ':')).map(trim).filter((x) => x);

  const modelsDefinitions = modelLines.map(getModel);
  const relationsDefinitions = relationsLines.map(getRelation);
  const singleRelations = flatten(relationsDefinitions.map(convertToSingleRelations));

  const singleModels = modelsDefinitions.map((modelDefinition): SingleErModel => {
    const modelSingleRelations = singleRelations.filter((r) => r.myTypeName === modelDefinition.name);
    return {
      name: modelDefinition.name,
      fields: modelDefinition.fields,
      relations: modelSingleRelations,
    };
  });

  return singleModels;
}
