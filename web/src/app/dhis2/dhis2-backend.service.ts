import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Dhis2Program, 
  Dhis2EventsPayload,
  Dhis2ProgramStageResponse
} from './dhis2-models';

@Injectable({
  providedIn: 'root'
})
export class Dhis2BackendService {
  private readonly API_BASE_URL = '/api';
  private readonly AUTH_CREDENTIALS = btoa('admin:district');

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

  getProgramStages(programId: string): Observable<Dhis2ProgramStageResponse> {
    const filter = 'program.id:eq:' + programId;
    const fields = 'id,programStageDataElements[dataElement[id,name,displayFormName,valueType,optionSetValue,optionSet[id,options[code,name]]]]';
    const url = `${this.API_BASE_URL}/programStages?filter=${filter}&fields=${fields}`;
    
    return this.http.get<Dhis2ProgramStageResponse>(url, {
      headers: this.getHeaders()
    });
  }

  postDataValues(
    payload: Dhis2EventsPayload
  ): Observable<any> {
    console.log('Post payload', payload);
    const url = `${this.API_BASE_URL}/tracker?async=false`;

    return this.http.post(url, payload, {
      headers: this.getHeaders()
    });
  }
}
