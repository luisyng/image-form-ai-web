import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BackendSender } from './backend-sender.interface';
import { Dhis2EventsPayload } from '../dhis2/dhis2-models';

export class MockBackendSender implements BackendSender {
  sendData(payload: Dhis2EventsPayload): Observable<void> {
    // Simulate API delay
    return of(null).pipe(
      delay(1500),
      map(() => void 0)
    );
  }
} 