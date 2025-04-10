import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BackendSender, BackendSenderResponse } from './backend-sender.interface';
import { Dhis2EventsPayload } from '../dhis2/dhis2-models';

export class MockBackendSender implements BackendSender {
  sendData(payload: Dhis2EventsPayload): Observable<BackendSenderResponse> {
    // Simulate API delay
    return of({
      success: true,
      id: 'mock_' + Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    }).pipe(delay(1500)); // 1.5 second delay
  }
} 