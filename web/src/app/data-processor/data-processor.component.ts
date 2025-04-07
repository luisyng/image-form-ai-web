import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProcessManager<T, R> {
  processData: (data: T) => Promise<R>;
  getProcessName: () => string;
}

@Component({
  selector: 'app-data-processor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-processor.component.html',
  styleUrls: ['./data-processor.component.scss']
})
export class DataProcessorComponent<T, R> implements OnChanges {
  @Input() inputData: T | null = null;
  @Input() processManager!: ProcessManager<T, R>;
  @Output() processingComplete = new EventEmitter<R>();
  
  isProcessing: boolean = false;
  isProcessingComplete: boolean = false;
  processingError: string | null = null;
  processResult: R | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputData'] && this.inputData) {
      this.resetState();
      // Automatically start processing when input data is provided
      this.processData();
    }
  }
  
  processData(): void {
    if (!this.inputData || !this.processManager) {
      console.error('No input data or process manager to process');
      return;
    }
    
    console.log('Processing data with', this.processManager.getProcessName());
    this.isProcessing = true;
    this.isProcessingComplete = false;
    this.processingError = null;
    
    this.processManager.processData(this.inputData)
      .then(result => {
        this.processResult = result;
        this.setProcessingComplete();
        this.processingComplete.emit(result);
      })
      .catch(error => {
        console.error('Processing error:', error);
        this.processingError = error.message || 'An error occurred during processing. Please try again.';
        this.isProcessing = false;
      });
  }
  
  private setProcessingComplete(): void {
    console.log('Setting processing complete');
    this.isProcessing = false;
    this.isProcessingComplete = true;
  }
  
  retryProcessing(): void {
    this.processingError = null;
    this.processData();
  }
  
  private resetState(): void {
    console.log('Resetting state');
    this.processResult = null;
    this.isProcessing = false;
    this.isProcessingComplete = false;
    this.processingError = null;
  }
} 