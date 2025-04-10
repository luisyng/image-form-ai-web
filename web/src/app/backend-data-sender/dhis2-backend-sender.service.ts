import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BackendSender, BackendSenderResponse } from './backend-sender.interface';
import { Dhis2BackendAdapter } from '../dhis2/dhis2-backend-adapter';
import { Dhis2EventsPayload } from '../dhis2/dhis2-models';

@Injectable({
  providedIn: 'root'
})
export class Dhis2BackendSender implements BackendSender {
  constructor(private dhis2Adapter: Dhis2BackendAdapter) {}

  sendData(payload: Dhis2EventsPayload): Observable<BackendSenderResponse> {
    return from(this.dhis2Adapter.postDataValues(payload)).pipe(
      map(response => ({
        success: true,
        id: response.response.importSummaries[0].reference,
        timestamp: new Date().toISOString()
      })),
      catchError(error => {
        throw {
          success: false,
          error: error.message || 'Error sending data to DHIS2'
        };
      })
    );
  }
} 