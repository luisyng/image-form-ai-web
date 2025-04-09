import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dhis2BackendService } from './dhis2-backend.service';
import { FormType } from '../models/form-type';
import { Dhis2Program, Dhis2DataElement, Dhis2ProgramStageDataElement } from './dhis2-models';
import { FormMetadata, DataElement, SelectOption } from '../models/form-metadata';

@Injectable({
  providedIn: 'root'
})
export class Dhis2BackendAdapter {
  constructor(private dhis2Service: Dhis2BackendService) {}

  getForms(): Observable<FormType[]> {
    return this.dhis2Service.getPrograms().pipe(
      map(programs => this.mapProgramsToFormTypes(programs))
    );
  }

  getFormMetadata(programId: string): Observable<FormMetadata> {
    return this.dhis2Service.getProgramStages(programId).pipe(
      map(programStageElements => this.mapToFormMetadata(programId, programStageElements))
    );
  }

  private mapProgramsToFormTypes(programs: Dhis2Program[]): FormType[] {
    return programs.map(program => ({
      id: program.id,
      name: program.displayName,
      icon: '📋' // Default icon for DHIS2 programs
    }));
  }

  private mapToFormMetadata(programId: string, elements: Dhis2ProgramStageDataElement[]): FormMetadata {
    return {
      id: programId,
      name: 'DHIS2 Form', // Could be fetched from program details if needed
      elements: elements.map(element => this.mapToDataElement(element.dataElement))
    };
  }

  private mapToDataElement(element: Dhis2DataElement): DataElement {
    const baseElement: DataElement = {
      id: element.id,
      name: element.displayFormName,
      type: element.valueType,
      defaultValue: this.getDefaultValueForType(element.valueType)
    };

    // Add options if the element has an option set
    if (element.optionSetValue && element.optionSet?.options) {
      baseElement.options = element.optionSet.options.map(option => ({
        value: option.code,
        label: option.name
      }));
    }

    return baseElement;
  }

  private getDefaultValueForType(valueType: string): any {
    switch (valueType) {
      case 'TEXT':
      case 'DATE':
        return '';
      case 'INTEGER_ZERO_OR_POSITIVE':
      case 'AGE':
        return 0;
      case 'BOOLEAN':
        return false;
      default:
        return null;
    }
  }
} 