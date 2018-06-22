export interface IFieldDefinition {
  name: string;
  type: string;
  visibility: string;
  dbType: string | undefined;
  optional: boolean;
}

export interface IModelDefinition {
  name: string;
  fields: Array<IFieldDefinition>;
}

export interface ISingleErRelation {
  otherTypeName: string;
  otherName: string;
  myTypeName: string;
  myName: string;
  relationType: string;
  optional: boolean;
}

export interface ISingleErModel {
  name: string;
  fields: Array<IFieldDefinition>;
  relations: Array<ISingleErRelation>;
}

export interface IRelationComponent {
  source: string;
  target: string;
  as: string;
  type: string;
  optional: boolean;
}
