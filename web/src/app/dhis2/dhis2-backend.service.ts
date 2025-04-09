import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dhis2Program } from './dhis2-models';

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
}
