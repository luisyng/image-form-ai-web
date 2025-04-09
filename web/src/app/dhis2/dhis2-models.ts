export interface Dhis2Program {
    id: string;
    displayName: string;
  }

export interface Dhis2Option {
  code: string;
  name: string;
}

export interface Dhis2OptionSet {
  id: string;
  options: Dhis2Option[];
}

export interface Dhis2DataElement {
  id: string;
  name: string;
  displayFormName: string;
  valueType: string;
  optionSetValue: boolean;
  optionSet?: Dhis2OptionSet;
}

export interface Dhis2ProgramStageDataElement {
  dataElement: Dhis2DataElement;
}

export interface Dhis2ProgramStageResponse {
  programStageDataElements: Dhis2ProgramStageDataElement[];
}
