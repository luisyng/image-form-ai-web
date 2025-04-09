import { ValueType } from "../models/form-metadata";

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
  valueType: ValueType;
  optionSetValue: boolean;
  optionSet?: Dhis2OptionSet;
}

export interface Dhis2ProgramStageDataElement {
  dataElement: Dhis2DataElement;
}

export interface Dhis2ProgramStageResponse {
  id: string;
  programStages: Dhis2ProgramStage[];
}

export interface Dhis2ProgramStage {
  id: string;
  programStageDataElements: Dhis2ProgramStageDataElement[];
}

export interface Dhis2ProgramStageDataElement {
  dataElement: Dhis2DataElement;
}

export interface Dhis2DataValue {
  dataElement: string;
  value: string;
}

export interface Dhis2Event {
  occurredAt: string;
  notes: any[];
  program: string;
  programStage: string;
  orgUnit: string;
  dataValues: Dhis2DataValue[];
}

export interface Dhis2EventsPayload {
  events: Dhis2Event[];
}
