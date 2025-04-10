import { Observable } from 'rxjs';
import { Dhis2EventsPayload } from '../dhis2/dhis2-models';

export interface BackendSender {
  sendData(payload: Dhis2EventsPayload): Observable<void>;
} 