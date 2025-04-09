import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Dhis2Program, 
  Dhis2ProgramStageResponse, 
  Dhis2ProgramStageDataElement,
  Dhis2EventsPayload,
  Dhis2Event 
} from './dhis2-models';

@Injectable({
  providedIn: 'root'
})
export class Dhis2BackendService {
  private readonly API_BASE_URL = '/api';
  private readonly AUTH_CREDENTIALS = btoa('admin:district');
  private readonly DEFAULT_ORG_UNIT = 'DiszpKrYNg8'; // Could be made configurable

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Basic ${this.AUTH_CREDENTIALS}`,
      'Content-Type': 'application/json'
    });
  }

  getPrograms(): Observable<Dhis2Program[]> {
    const url = `${this.API_BASE_URL}/programs`;
    
    return this.http.get(url, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => {
        // Map the response to our Dhis2Program interface
        return response.programs?.map((program: any) => ({
          id: program.id,
          displayName: program.displayName
        })) || [];
      })
    );
  }

  getProgramStages(programId: string): Observable<Dhis2ProgramStageDataElement[]> {
    const filter = 'program.id:eq:' + programId;
    const fields = 'programStageDataElements[dataElement[id,name,displayFormName,valueType,optionSetValue,optionSet[id,options[code,name]]]]';
    const url = `${this.API_BASE_URL}/programStages?filter=${filter}&fields=${fields}`;
    
    return this.http.get<any>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        // Get the first program stage
        const programStage = response.programStages?.[0];
        if (!programStage) {
          return [];
        }
        return programStage.programStageDataElements || [];
      })
    );
  }

  postDataValues(
    programId: string, 
    programStageId: string, 
    dataValues: { [key: string]: any }
  ): Observable<any> {
    const url = `${this.API_BASE_URL}/tracker?async=false`;
    
    const payload: Dhis2EventsPayload = {
      events: [{
        occurredAt: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
        notes: [],
        program: programId,
        programStage: programStageId,
        orgUnit: this.DEFAULT_ORG_UNIT,
        dataValues: Object.entries(dataValues).map(([key, value]) => ({
          dataElement: key,
          value: value?.toString() || ''
        }))
      }]
    };

    return this.http.post(url, payload, {
      headers: this.getHeaders()
    });
  }
}
