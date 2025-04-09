import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dhis2BackendService } from './dhis2-backend.service';
import { FormType } from '../models/form-type';
import { Dhis2Program } from './dhis2-models';

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

  private mapProgramsToFormTypes(programs: Dhis2Program[]): FormType[] {
    return programs.map(program => ({
      id: program.id,
      name: program.displayName,
      icon: '📋' // Default icon for DHIS2 programs
    }));
  }
} 