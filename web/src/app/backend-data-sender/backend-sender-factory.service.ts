import { Server } from "../models/server";
import { BackendSender } from "./backend-sender.interface";
import { Dhis2BackendSender } from "./dhis2-backend-sender.service";
import { MockBackendSender } from "./mock-backend-sender.service";
import { Dhis2BackendAdapter } from "../dhis2/dhis2-backend-adapter";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BackendSenderFactory {
    constructor(private dhis2BackendAdapter: Dhis2BackendAdapter) {}

    getSender(server: Server): BackendSender {
        if (server.type === 'dhis2') {
            return new Dhis2BackendSender(this.dhis2BackendAdapter);
        } else {
            return new MockBackendSender();
        }
    }
}