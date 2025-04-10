import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BackendSender } from './backend-sender.interface';
import { Dhis2BackendAdapter } from '../dhis2/dhis2-backend-adapter';
import { Dhis2EventsPayload } from '../dhis2/dhis2-models';

interface Dhis2Response {
  status: string;
  stats: {
    created: number;
    updated: number;
    deleted: number;
    ignored: number;
    total: number;
  };
}

export class Dhis2BackendSender implements BackendSender {
  constructor(private dhis2Adapter: Dhis2BackendAdapter) {}

  sendData(payload: Dhis2EventsPayload): Observable<void> {
    console.log('Send payload', payload);
    return from(this.dhis2Adapter.postDataValues(payload)).pipe(
      map((response: Dhis2Response) => {
        console.log('Response', response);
        if (response.status === 'OK' && response.stats.created === 1) {
          return;
        } else {
          throw new Error('Failed to create event in DHIS2');
        }
      }),
      catchError(error => {
        console.log('Error', error);
        throw error.message || 'Error sending data to DHIS2';
      })
    );
  }
} 