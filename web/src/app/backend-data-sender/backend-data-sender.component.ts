import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-backend-data-sender',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './backend-data-sender.component.html',
  styleUrls: ['./backend-data-sender.component.scss']
})
export class BackendDataSenderComponent {
  @Input() payload: any = null;
  @Output() sendSuccess = new EventEmitter<any>();
  @Output() sendError = new EventEmitter<string>();
  
  isSending = false;
  sendComplete = false;
  isError = false;
  errorMessage = '';
  responseData: any = null;
  
  // For display purposes
  formattedJson = '';
  
  constructor(private http: HttpClient) {}
  
  ngOnChanges() {
    if (this.payload) {
      this.formattedJson = JSON.stringify(this.payload, null, 2);
    }
  }
  
  sendData() {
    if (!this.payload) {
      this.errorMessage = 'No data to send';
      this.isError = true;
      return;
    }
    
    this.isSending = true;
    this.sendComplete = false;
    this.isError = false;
    this.errorMessage = '';
    this.responseData = null;
    
    // Replace with your actual API endpoint
    const apiUrl = 'https://api.example.com/submit-data';
    
    // For demo purposes, we'll simulate a successful API call
    setTimeout(() => {
      this.isSending = false;
      this.sendComplete = true;
      this.responseData = {
        success: true,
        id: 'record_' + Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString()
      };
      this.sendSuccess.emit(this.responseData);
      
      // Uncomment this to use actual HTTP request
      /*
      this.http.post(apiUrl, this.payload).subscribe({
        next: (response) => {
          this.isSending = false;
          this.sendComplete = true;
          this.responseData = response;
          this.sendSuccess.emit(response);
        },
        error: (error) => {
          this.isSending = false;
          this.sendError = true;
          this.errorMessage = error.message || 'An error occurred while sending data';
          this.sendError.emit(this.errorMessage);
        }
      });
      */
    }, 1500);
  }
  
  reset() {
    this.sendComplete = false;
    this.isError = false;
    this.errorMessage = '';
    this.responseData = null;
  }
} 