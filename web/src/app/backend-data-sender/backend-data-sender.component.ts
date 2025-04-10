import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDataProjection } from '../models/form-data';
import { Dhis2BackendAdapter } from '../dhis2/dhis2-backend-adapter';
import { Dhis2EventsPayload } from '../dhis2/dhis2-models';
import { FormMetadata } from '../models/form-metadata';
import { BackendSender } from './backend-sender.interface';

@Component({
  selector: 'app-backend-data-sender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backend-data-sender.component.html',
  styleUrls: ['./backend-data-sender.component.scss']
})
export class BackendDataSenderComponent {
  @Input() formMetadata!: FormMetadata;
  @Input() formData!: FormDataProjection;
  @Input() backendSender!: BackendSender;
  @Output() sendSuccess = new EventEmitter<any>();
  @Output() sendError = new EventEmitter<string>();
  
  isSending = false;
  sendComplete = false;
  isError = false;
  errorMessage = '';
  responseData: any = null;

  payload: Dhis2EventsPayload | null = null;
  
  // For display purposes
  formattedJson = '';

  constructor(private dhis2BackendAdapter: Dhis2BackendAdapter) {}
    
  ngOnChanges() {
    if (this.formData) {
      this.payload = this.dhis2BackendAdapter.buildEventsPayload(
        this.formMetadata.programId, 
        this.formMetadata.id, 
        this.formData
      );
      this.formattedJson = JSON.stringify(this.payload, null, 2);
    }
  }
  
  sendData() {
    if (!this.formData || !this.payload) {
      this.errorMessage = 'No data to send';
      this.isError = true;
      return;
    }
    
    this.isSending = true;
    this.sendComplete = false;
    this.isError = false;
    this.errorMessage = '';
    this.responseData = null;
    
    this.backendSender.sendData(this.payload).subscribe({
      next: (response) => {
        this.isSending = false;
        this.sendComplete = true;
        this.responseData = response;
        this.sendSuccess.emit(response);
      },
      error: (error) => {
        this.isSending = false;
        this.isError = true;
        this.errorMessage = error.message || 'An error occurred while sending data';
        this.sendError.emit(this.errorMessage);
      }
    });
  }
} 